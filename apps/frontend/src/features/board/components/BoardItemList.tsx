import type {
  BoardActions,
  BoardItem,
  BoardMember,
} from "../types/board.types";
import { BoardSlotRow } from "./BoardSlotRow";

export function BoardItemList({
  items,
  canEdit,
  currentMembership,
  members,
  actions,
}: {
  items: BoardItem[];
  canEdit: boolean;
  currentMembership?: BoardMember;
  members: BoardMember[];
  actions: BoardActions;
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <BoardSlotRow
          canEdit={canEdit}
          context={`${item.room.name} · ${item.bundle.name}`}
          currentMembership={currentMembership}
          key={item.slot.id}
          members={members}
          onClaim={(membershipId) => actions.claim(item.slot.id, membershipId)}
          onCollect={(collected) => actions.collect(item.slot.id, collected)}
          onRelease={() => actions.release(item.slot.id)}
          pending={actions.isSlotPending(item.slot.id)}
          slot={item.slot}
        />
      ))}
    </ul>
  );
}
