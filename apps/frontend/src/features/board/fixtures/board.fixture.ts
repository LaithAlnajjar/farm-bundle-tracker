import type { BoardSlot, FarmBoard } from "../types/board.types";

const slot = (
  id: number,
  name: string,
  state: "needed" | "claimed" | "collected" | "optional",
): BoardSlot => ({
  id,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  sortOrder: id,
  quantity: name === "Parsnip" ? 5 : 1,
  minimumQuality: name === "Parsnip" ? "gold" : "standard",
  item: {
    id,
    slug: name.toLowerCase().replaceAll(" ", "-"),
    name,
    category: name === "Walleye" ? "fish" : "crops",
    availability: {
      seasons: name === "Pumpkin" ? ["fall"] : ["spring"],
      details: `${name} is available during its listed season.`,
    },
  },
  collection:
    state === "collected"
      ? {
          userId: 1,
          username: "laith",
          collectedAt: "2026-07-22T09:00:00.000Z",
        }
      : null,
  claim:
    state === "claimed"
      ? {
          membershipId: 2,
          userId: 2,
          username: "leah",
          claimedAt: "2026-07-22T09:10:00.000Z",
        }
      : null,
  needed: state === "needed" || state === "claimed",
  claimable: state === "needed" || state === "claimed",
});

export const dashboardFixture: FarmBoard = {
  farm: {
    id: 99,
    name: "Willow Creek",
    currentSeason: "spring",
    membershipRole: "editor",
  },
  catalog: {
    id: 1,
    slug: "vanilla-1-6-15",
    name: "Vanilla Community Center",
    gameVersion: "1.6.15",
  },
  canEdit: true,
  progress: { completed: 1, total: 3, percentage: 33, complete: false },
  claimableMembers: [
    { membershipId: 1, userId: 1, username: "laith", role: "editor" },
    { membershipId: 2, userId: 2, username: "leah", role: "owner" },
    { membershipId: 3, userId: 3, username: "sam", role: "editor" },
  ],
  rooms: [
    {
      id: 1,
      slug: "pantry",
      name: "Pantry",
      completionReward: "Greenhouse",
      sortOrder: 1,
      progress: { completed: 1, total: 2, percentage: 50, complete: false },
      bundles: [
        {
          id: 1,
          slug: "spring-crops",
          name: "Spring Crops",
          completionReward: "20 Speed-Gro",
          requiredSlots: 4,
          sortOrder: 1,
          progress: {
            collected: 2,
            credited: 2,
            required: 4,
            total: 4,
            percentage: 50,
            complete: false,
          },
          slots: [
            slot(1, "Parsnip", "needed"),
            slot(2, "Green Bean", "claimed"),
            slot(3, "Cauliflower", "collected"),
            slot(4, "Potato", "collected"),
          ],
        },
        {
          id: 2,
          slug: "quality-crops",
          name: "Quality Crops",
          completionReward: "Preserves Jar",
          requiredSlots: 3,
          sortOrder: 2,
          progress: {
            collected: 3,
            credited: 3,
            required: 3,
            total: 4,
            percentage: 100,
            complete: true,
          },
          slots: [
            slot(5, "Melon", "collected"),
            slot(6, "Corn", "collected"),
            slot(7, "Yam", "collected"),
            slot(8, "Pumpkin", "optional"),
          ],
        },
      ],
    },
    {
      id: 2,
      slug: "fish-tank",
      name: "Fish Tank",
      completionReward: "Glittering Boulder Removed",
      sortOrder: 2,
      progress: { completed: 0, total: 1, percentage: 0, complete: false },
      bundles: [
        {
          id: 3,
          slug: "night-fishing",
          name: "Night Fishing",
          completionReward: "Small Glow Ring",
          requiredSlots: 3,
          sortOrder: 1,
          progress: {
            collected: 0,
            credited: 0,
            required: 3,
            total: 3,
            percentage: 0,
            complete: false,
          },
          slots: [
            slot(9, "Walleye", "needed"),
            slot(10, "Bream", "needed"),
            slot(11, "Eel", "claimed"),
          ],
        },
      ],
    },
  ],
};
