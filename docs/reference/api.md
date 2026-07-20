# HTTP API contract

This guide describes the implemented HTTP surface and its cross-cutting
behavior. Request and response properties remain defined by the DTOs under each
module's `presentation/dtos` directory; duplicating every field here would
create a second, manually maintained schema.

## Transport conventions

The local API base URL is `http://localhost:3000`. Routes have no global
`/api` prefix. Request and response bodies are JSON except for empty `204`
responses and the HTTP-only refresh cookie.

The API allows credentialed CORS from the comma-separated origins in
`FRONTEND_URL`. Global validation whitelists declared DTO properties and rejects
unknown properties. Integer path identifiers use Nest's integer parser.

Dates in response DTOs are ISO 8601 strings. HTTP status and error bodies use
Nest conventions unless a domain exception filter specifies otherwise.

## Sessions

Registration creates an account but does not sign it in. Sign-in returns an
access token and sets an opaque refresh token as an HTTP-only cookie. The
frontend stores the access token only in memory and sends it as:

```http
Authorization: Bearer <access-token>
```

The default refresh cookie is named `refresh_token`, scoped to `/auth`, uses
`SameSite=Lax`, and becomes `Secure` in production. PostgreSQL stores only its
SHA-256 hash.

Refreshing rotates both tokens and links the old database record to its
replacement. Reuse of a replaced token invalidates the affected active token
chain. Logout revokes the presented refresh token when present and clears the
cookie; it remains safe to call with no valid session.

The shared frontend client responds to one authenticated `401` by joining a
single in-flight refresh request and retrying the original request once. The
refresh call itself is never retried through that mechanism.

## Authentication routes

| Method and path | Access | Purpose |
| --- | --- | --- |
| `POST /auth/register` | Public | Create a user with unique email and username |
| `POST /auth/signin` | Public | Verify credentials, return identity and access token, set refresh cookie |
| `POST /auth/refresh` | Public route; valid refresh cookie required for success | Rotate the session and return a new access token |
| `POST /auth/logout` | Public/idempotent | Revoke the cookie token when available and clear the cookie |
| `GET /auth/me` | Bearer token | Return the authenticated user's identity |

## Farm routes

| Method and path | Required access | Purpose |
| --- | --- | --- |
| `POST /farms` | Authenticated | Create a farm and its owner membership |
| `GET /farms` | Authenticated | List non-deleted farms where the caller is a member |
| `GET /farms/:id` | Member | Read one farm and the caller's role |
| `PATCH /farms/:id` | Owner | Rename a farm |
| `DELETE /farms/:id` | Owner | Soft-delete a farm; returns `204` |

Farm names are trimmed by application behavior, must contain at least one
character, and are limited to 255 characters by the request DTO.

## Membership routes

| Method and path | Required access | Purpose |
| --- | --- | --- |
| `GET /farms/:farmId/members` | Member | List memberships and public account identity fields |
| `POST /farms/:farmId/members` | Owner | Add a registered user by username or email as editor/viewer |
| `PATCH /farms/:farmId/members/:membershipId` | Owner | Change editor/viewer role or transfer ownership |
| `DELETE /farms/:farmId/members/me` | Non-owner member | Leave the farm; returns `204` |
| `DELETE /farms/:farmId/members/:membershipId` | Owner | Remove a non-owner member; returns `204` |

Changing a member's role to `owner` transfers ownership transactionally and
demotes the actor to editor. The current owner cannot be demoted, removed, or
leave without first transferring ownership.

## Invite routes

| Method and path | Required access | Purpose |
| --- | --- | --- |
| `POST /farms/:farmId/invites` | Owner | Create an eight-day multi-use invite; plaintext token appears only in this response |
| `GET /farms/:farmId/invites` | Owner | List invite metadata and active/expired/revoked status |
| `DELETE /farms/:farmId/invites/:inviteId` | Owner | Revoke an active invite; returns `204` |
| `GET /farm-invites/:token` | Public | Preview farm name and expiry for an active token |
| `POST /farm-invites/:token/redeem` | Bearer token | Add the caller as editor and return the farm |

Redeeming an active invite is idempotent for an existing member and does not
consume the link. Revocation, expiration, or farm deletion makes preview and
redemption fail as not found.

## Farm capability matrix

| Capability | Owner | Editor | Viewer |
| --- | :---: | :---: | :---: |
| View farm and member data | Yes | Yes | Yes |
| Edit the future bundle board | Yes | Yes | No |
| Manage members and transfer ownership | Yes | No | No |
| Manage invites | Yes | No | No |
| Rename or delete the farm | Yes | No | No |

The `edit-board` capability exists in the domain policy for the next product
slice, but no board endpoints are implemented yet.

## Errors

| Status | Meaning in the current API |
| --- | --- |
| `400 Bad Request` | DTO validation failure or invalid workflow, such as an owner leaving before transfer |
| `401 Unauthorized` | Missing/invalid bearer token, invalid credentials, invalid refresh token, or refresh-token reuse |
| `403 Forbidden` | A farm member is known but lacks the required capability |
| `404 Not Found` | Resource absent, invite inactive, user identifier absent, or caller is not a farm member |
| `409 Conflict` | Unique account/membership conflict or failed concurrent ownership transition |

Returning `404` for a non-member is deliberate: it avoids confirming whether a
farm exists. Clients should branch on status and user intent, not parse error
message strings as a stable machine contract.

## Direction

Catalog reads, board state, collection mutations, claim mutations, and
real-time events remain roadmap work. Their wire shapes will be documented only
when implemented. If the API adopts OpenAPI, generated schemas become the
detailed reference while this page remains the guide to lifecycle and policy.
