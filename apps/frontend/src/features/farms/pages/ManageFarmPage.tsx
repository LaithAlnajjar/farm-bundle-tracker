import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAuth } from "@/features/auth";
import { useAddFarmMember } from "../hooks/useAddFarmMember";
import { useCreateFarmInvite } from "../hooks/useCreateFarmInvite";
import { useDeleteFarm } from "../hooks/useDeleteFarm";
import { useFarm } from "../hooks/useFarm";
import { useFarmInvites } from "../hooks/useFarmInvites";
import { useFarmMembers } from "../hooks/useFarmMembers";
import { useLeaveFarm } from "../hooks/useLeaveFarm";
import { useRemoveFarmMember } from "../hooks/useRemoveFarmMember";
import { useRenameFarm } from "../hooks/useRenameFarm";
import { useRevokeFarmInvite } from "../hooks/useRevokeFarmInvite";
import { useUpdateFarmMemberRole } from "../hooks/useUpdateFarmMemberRole";
import type { FarmRole } from "../types/farm.types";
import {
  ChunkyButton,
  NoteCard,
  PixelIcon,
  WoodBoard,
} from "@/shared/components/farm-ui";
import { formatDate } from "@/shared/lib/formatDate";

export function ManageFarmPage() {
  const farmId = Number(useParams().farmId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const farmQuery = useFarm(farmId);
  const membersQuery = useFarmMembers(farmId);
  const isOwner = farmQuery.data?.membershipRole === "owner";
  const invitesQuery = useFarmInvites(farmId, isOwner);
  const [createdInviteLink, setCreatedInviteLink] = useState<string | null>(
    null,
  );

  const addMemberMutation = useAddFarmMember(farmId);
  const roleMutation = useUpdateFarmMemberRole(farmId);
  const removeMutation = useRemoveFarmMember(farmId);
  const leaveMutation = useLeaveFarm(farmId, () =>
    navigate("/farms", { replace: true }),
  );
  const createInviteMutation = useCreateFarmInvite(farmId, (invite) => {
    setCreatedInviteLink(`${window.location.origin}/join/${invite.token}`);
  });
  const revokeInviteMutation = useRevokeFarmInvite(farmId);
  const renameMutation = useRenameFarm(farmId);
  const deleteMutation = useDeleteFarm(farmId, () =>
    navigate("/farms", { replace: true }),
  );

  const submitMember = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    addMemberMutation.mutate({
      identifier: String(data.get("identifier") ?? "").trim(),
      role: String(data.get("role") ?? "editor") as "editor" | "viewer",
    });
    form.reset();
  };

  const submitRename = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    renameMutation.mutate(String(data.get("name") ?? "").trim());
  };

  const changeRole = (
    event: ChangeEvent<HTMLSelectElement>,
    membershipId: number,
  ) => {
    const role = event.target.value as FarmRole;
    if (
      role === "owner" &&
      !window.confirm(
        "Transfer ownership to this member? You will become an editor.",
      )
    ) {
      return;
    }
    roleMutation.mutate({ membershipId, role });
  };

  if (farmQuery.isPending || membersQuery.isPending) {
    return <CenteredMessage message="Loading farm management…" />;
  }
  if (farmQuery.isError || membersQuery.isError || !farmQuery.data) {
    return <CenteredMessage message="This farm could not be loaded." />;
  }

  const farm = farmQuery.data;
  const mutationError =
    addMemberMutation.error ??
    roleMutation.error ??
    removeMutation.error ??
    leaveMutation.error ??
    createInviteMutation.error ??
    revokeInviteMutation.error ??
    renameMutation.error ??
    deleteMutation.error;

  return (
    <main className="min-h-screen bg-background">
      <section className="page-container px-5 py-8 sm:px-8 sm:py-12">
        <Link
          className="font-micro text-[11px] tracking-[2px] uppercase text-berry"
          to="/farms"
        >
          ← My farms
        </Link>
        <header className="mt-3 mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-micro text-[11px] tracking-[2px] uppercase text-soil">
              {farm.membershipRole} access
            </p>
            <h1 className="font-display text-5xl leading-none font-bold text-ink">
              {farm.name}
            </h1>
          </div>
          {!isOwner ? (
            <ChunkyButton
              disabled={leaveMutation.isPending}
              onClick={() => {
                if (window.confirm(`Leave ${farm.name}?`))
                  leaveMutation.mutate();
              }}
              variant="danger"
            >
              Leave farm
            </ChunkyButton>
          ) : null}
        </header>

        {mutationError ? (
          <p
            className="mb-5 rounded-sm border-3 border-berry bg-berry-mist p-3 font-body text-xl text-berry-ink"
            role="alert"
          >
            {mutationError.message}
          </p>
        ) : null}

        <WoodBoard innerClassName="grid gap-6 p-5 sm:p-7 lg:grid-cols-2">
          <NoteCard pin className="p-5 pt-7">
            <h2 className="font-display text-3xl font-bold text-ink">
              Members
            </h2>
            <div className="mt-4 space-y-3">
              {membersQuery.data?.map((member) => (
                <div
                  className="rounded-sm border-2 border-soil bg-parchment p-3"
                  key={member.id}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-display text-xl font-bold text-ink">
                        {member.username}
                        {member.userId === user?.id ? " (you)" : ""}
                      </p>
                      <p className="font-body text-lg text-ink-soft">
                        {member.email}
                      </p>
                    </div>
                    {isOwner && member.role !== "owner" ? (
                      <div className="flex items-center gap-2">
                        <select
                          aria-label={`Role for ${member.username}`}
                          className="rounded-sm border-2 border-bark bg-paper px-2 py-1 font-body text-lg"
                          disabled={roleMutation.isPending}
                          onChange={(event) => changeRole(event, member.id)}
                          value={member.role}
                        >
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                          <option value="owner">Owner</option>
                        </select>
                        <button
                          className="font-display text-base font-bold text-berry underline"
                          disabled={removeMutation.isPending}
                          onClick={() => {
                            if (window.confirm(`Remove ${member.username}?`)) {
                              removeMutation.mutate(member.id);
                            }
                          }}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <span className="rounded-sm border-2 border-soil bg-paper px-2 py-1 font-micro text-[10px] uppercase text-soil">
                        {member.role}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isOwner ? (
              <form
                className="seam-dashed mt-5 space-y-3 pt-4"
                onSubmit={submitMember}
              >
                <label className="block font-display text-lg font-bold text-ink">
                  Add by username or email
                  <input
                    className="mt-1 w-full rounded-sm border-2 border-bark bg-paper px-3 py-2 font-body text-xl font-normal"
                    maxLength={255}
                    name="identifier"
                    required
                  />
                </label>
                <div className="flex gap-3">
                  <select
                    className="rounded-sm border-2 border-bark bg-paper px-3 font-body text-xl"
                    defaultValue="editor"
                    name="role"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <ChunkyButton
                    disabled={addMemberMutation.isPending}
                    type="submit"
                  >
                    Add member
                  </ChunkyButton>
                </div>
              </form>
            ) : null}
          </NoteCard>

          {isOwner ? (
            <NoteCard pin className="p-5 pt-7">
              <h2 className="font-display text-3xl font-bold text-ink">
                Invite links
              </h2>
              <p className="mt-1 font-body text-lg text-ink-soft">
                Links are multi-use and expire eight days after creation.
              </p>
              <ChunkyButton
                className="mt-4"
                disabled={createInviteMutation.isPending}
                onClick={() => createInviteMutation.mutate()}
              >
                Create invite
              </ChunkyButton>

              {createdInviteLink ? (
                <div className="mt-4 rounded-sm border-2 border-leaf bg-leaf-soft p-3">
                  <p className="break-all font-body text-lg text-ink">
                    {createdInviteLink}
                  </p>
                  <button
                    className="mt-2 font-display font-bold text-leaf-dark underline"
                    onClick={() =>
                      void navigator.clipboard.writeText(createdInviteLink)
                    }
                    type="button"
                  >
                    Copy link
                  </button>
                </div>
              ) : null}

              <div className="mt-4 space-y-3">
                {invitesQuery.data?.map((invite) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-sm border-2 border-soil bg-parchment p-3"
                    key={invite.id}
                  >
                    <div>
                      <p className="font-display text-lg font-bold capitalize text-ink">
                        {invite.status}
                      </p>
                      <p className="font-body text-base text-ink-soft">
                        Expires {formatDate(invite.expiresAt)}
                      </p>
                    </div>
                    {invite.status === "active" ? (
                      <button
                        className="font-display font-bold text-berry underline"
                        onClick={() => revokeInviteMutation.mutate(invite.id)}
                        type="button"
                      >
                        Revoke
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </NoteCard>
          ) : null}

          {isOwner ? (
            <NoteCard className="p-5 lg:col-span-2">
              <h2 className="font-display text-3xl font-bold text-ink">
                Farm settings
              </h2>
              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row"
                onSubmit={submitRename}
              >
                <input
                  className="flex-1 rounded-sm border-2 border-bark bg-paper px-3 py-2 font-body text-xl"
                  defaultValue={farm.name}
                  maxLength={255}
                  name="name"
                  required
                />
                <ChunkyButton disabled={renameMutation.isPending} type="submit">
                  Rename
                </ChunkyButton>
              </form>
              <div className="seam-dashed mt-5 pt-4">
                <ChunkyButton
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    if (window.confirm(`Permanently delete ${farm.name}?`)) {
                      deleteMutation.mutate();
                    }
                  }}
                  variant="danger"
                >
                  Delete farm
                </ChunkyButton>
              </div>
            </NoteCard>
          ) : null}
        </WoodBoard>
      </section>
    </main>
  );
}

function CenteredMessage({ message }: { message: string }) {
  return (
    <main className="cork flex min-h-screen items-center justify-center px-5">
      <NoteCard pin className="p-7 text-center">
        <PixelIcon name="sprout" size={36} />
        <p className="mt-3 font-display text-2xl font-bold text-ink">
          {message}
        </p>
        <Link
          className="mt-4 inline-block font-display text-berry underline"
          to="/farms"
        >
          Back to farms
        </Link>
      </NoteCard>
    </main>
  );
}
