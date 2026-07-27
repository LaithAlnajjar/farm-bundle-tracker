import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { BoardSlot } from "../types/board.types";
import { BoardSlotRow } from "./BoardSlotRow";

const slot: BoardSlot = {
  id: 1,
  slug: "parsnip",
  sortOrder: 1,
  quantity: 5,
  minimumQuality: "gold",
  item: {
    id: 1,
    slug: "parsnip",
    name: "Parsnip",
    category: "crops",
    availability: { seasons: ["spring"], details: "Spring crop" },
  },
  collection: null,
  claim: null,
  needed: true,
  claimable: true,
};

const members = [
  { membershipId: 10, userId: 1, username: "farmer", role: "editor" as const },
  { membershipId: 11, userId: 2, username: "friend", role: "owner" as const },
];

describe("BoardSlotRow", () => {
  it("collects and self-claims with direct controls", async () => {
    const user = userEvent.setup();
    const onCollect = vi.fn();
    const onClaim = vi.fn();
    render(
      <BoardSlotRow
        slot={slot}
        canEdit
        currentMembership={members[0]}
        members={members}
        pending={false}
        onCollect={onCollect}
        onClaim={onClaim}
        onRelease={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button", { name: /collect/i }));
    await user.click(screen.getByRole("button", { name: /^claim$/i }));
    expect(onCollect).toHaveBeenCalledWith(true);
    expect(onClaim).toHaveBeenCalledWith(10);
    expect(screen.getByText(/5 required · gold quality/i)).toBeInTheDocument();
  });

  it("renders state without write controls for viewers", () => {
    render(
      <BoardSlotRow
        slot={slot}
        canEdit={false}
        members={members}
        pending={false}
        onCollect={vi.fn()}
        onClaim={vi.fn()}
        onRelease={vi.fn()}
      />,
    );
    expect(
      screen.queryByRole("button", { name: /collect/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^claim$/i }),
    ).not.toBeInTheDocument();
  });

  it("reassigns and releases a claim from the item action sheet", async () => {
    const user = userEvent.setup();
    const onClaim = vi.fn();
    const onRelease = vi.fn();
    render(
      <BoardSlotRow
        canEdit
        currentMembership={members[0]}
        members={members}
        onClaim={onClaim}
        onCollect={vi.fn()}
        onRelease={onRelease}
        pending={false}
        slot={{
          ...slot,
          claim: {
            membershipId: 11,
            userId: 2,
            username: "friend",
            claimedAt: "2026-07-22T00:00:00.000Z",
          },
        }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "friend" }));
    await user.click(screen.getByRole("button", { name: /farmer \(you\)/i }));
    expect(onClaim).toHaveBeenCalledWith(10);

    await user.click(screen.getByRole("button", { name: /details for parsnip/i }));
    await user.click(screen.getByRole("button", { name: /release friend's claim/i }));
    expect(onRelease).toHaveBeenCalledOnce();
  });
});
