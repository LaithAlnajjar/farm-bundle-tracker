import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Copy, Link as LinkIcon, Settings, UserPlus, Users } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useAuth } from "@/features/auth";
import { FarmAppShell } from "../components/FarmAppShell";
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
import type { FarmMember, FarmRole } from "../types/farm.types";
import {
  ChunkyButton,
  FarmDialog,
  NoteCard,
  PixelIcon,
  StatusBadge,
  UserBadge,
  useFarmToast,
} from "@/shared/components/farm-ui";
import { formatDate } from "@/shared/lib/formatDate";
import { cn } from "@/shared/lib/utils";

type ManagementTab = "members" | "invites" | "settings";
type Confirmation =
  | { kind: "transfer"; member: FarmMember }
  | { kind: "remove"; member: FarmMember }
  | { kind: "leave" }
  | { kind: "delete" }
  | null;

export function ManageFarmPage() {
  const farmId = Number(useParams().farmId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useFarmToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const [deleteName, setDeleteName] = useState("");
  const [createdInviteLink, setCreatedInviteLink] = useState<string | null>(null);
  const farmQuery = useFarm(farmId);
  const membersQuery = useFarmMembers(farmId);
  const isOwner = farmQuery.data?.membershipRole === "owner";
  const invitesQuery = useFarmInvites(farmId, isOwner);
  const requestedTab = searchParams.get("tab") as ManagementTab | null;
  const tab: ManagementTab =
    requestedTab === "settings" ||
    (requestedTab === "invites" && isOwner) ||
    requestedTab === "members"
      ? requestedTab
      : "members";

  const addMemberMutation = useAddFarmMember(farmId);
  const roleMutation = useUpdateFarmMemberRole(farmId);
  const removeMutation = useRemoveFarmMember(farmId);
  const leaveMutation = useLeaveFarm(farmId, () => navigate("/farms", { replace: true }));
  const createInviteMutation = useCreateFarmInvite(farmId, (invite) => {
    setCreatedInviteLink(`${window.location.origin}/join/${invite.token}`);
  });
  const revokeInviteMutation = useRevokeFarmInvite(farmId);
  const renameMutation = useRenameFarm(farmId);
  const deleteMutation = useDeleteFarm(farmId, () => navigate("/farms", { replace: true }));

  if (farmQuery.isPending || membersQuery.isPending) {
    return <CenteredMessage message="Loading farm settings…" />;
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

  const setTab = (next: ManagementTab) => {
    const params = new URLSearchParams();
    if (next !== "members") params.set("tab", next);
    setSearchParams(params);
  };

  const submitMember = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    addMemberMutation.mutate(
      {
        identifier: String(data.get("identifier") ?? "").trim(),
        role: String(data.get("role") ?? "editor") as "editor" | "viewer",
      },
      { onSuccess: () => form.reset() },
    );
  };

  const submitRename = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    renameMutation.mutate(String(data.get("name") ?? "").trim());
  };

  const changeRole = (event: ChangeEvent<HTMLSelectElement>, member: FarmMember) => {
    const role = event.target.value as FarmRole;
    if (role === "owner") {
      event.target.value = member.role;
      setConfirmation({ kind: "transfer", member });
      return;
    }
    roleMutation.mutate({ membershipId: member.id, role });
  };

  return (
    <FarmAppShell farm={farm}>
      <main className="page-container px-4 py-6 sm:px-8 sm:py-9">
        <header className="mb-6">
          <p className="font-micro text-[9px] tracking-[0.13em] text-soil uppercase">
            Farm management
          </p>
          <h1 className="mt-1 font-display text-5xl leading-none font-bold text-ink">
            {farm.name}
          </h1>
          <p className="mt-2 font-ui text-sm text-ink-soft">
            Members, invitations, and farm-level settings.
          </p>
        </header>

        <nav className="mb-5 flex gap-2 overflow-x-auto pb-2" aria-label="Farm settings">
          <TabButton active={tab === "members"} icon={Users} onClick={() => setTab("members")}>
            Members
          </TabButton>
          {isOwner ? (
            <TabButton active={tab === "invites"} icon={LinkIcon} onClick={() => setTab("invites")}>
              Invites
            </TabButton>
          ) : null}
          <TabButton active={tab === "settings"} icon={Settings} onClick={() => setTab("settings")}>
            Farm settings
          </TabButton>
        </nav>

        {mutationError ? (
          <p className="mb-5 rounded-xl border-2 border-berry bg-berry-mist p-3 font-ui text-sm text-berry-ink" role="alert">
            {mutationError.message}
          </p>
        ) : null}

        {tab === "members" ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
            <NoteCard className="rounded-xl border-3 border-bark bg-paper p-4 shadow-drop-4 sm:p-5">
              <h2 className="font-display text-3xl font-bold text-ink">Farm team</h2>
              <div className="mt-4 space-y-2">
                {membersQuery.data?.map((member) => (
                  <div className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-sand-strong bg-parchment p-3" key={member.id}>
                    <UserBadge userId={member.userId} username={member.username} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-ui text-sm font-bold text-ink">
                        {member.username}{member.userId === user?.id ? " (you)" : ""}
                      </p>
                      <p className="truncate font-ui text-xs text-ink-soft">{member.email}</p>
                    </div>
                    {isOwner && member.role !== "owner" ? (
                      <div className="flex items-center gap-2">
                        <select
                          aria-label={`Role for ${member.username}`}
                          className="min-h-11 rounded-lg border-2 border-bark bg-paper px-2 font-ui text-sm"
                          disabled={roleMutation.isPending}
                          onChange={(event) => changeRole(event, member)}
                          value={member.role}
                        >
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                          <option value="owner">Owner</option>
                        </select>
                        <button
                          className="min-h-11 px-2 font-display font-bold text-berry underline"
                          disabled={removeMutation.isPending}
                          onClick={() => setConfirmation({ kind: "remove", member })}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <StatusBadge tone="neutral">{member.role}</StatusBadge>
                    )}
                  </div>
                ))}
              </div>
            </NoteCard>

            {isOwner ? (
              <NoteCard className="h-fit rounded-xl border-3 border-bark bg-paper p-5 shadow-drop-4">
                <p className="inline-flex items-center gap-2 font-micro text-[9px] tracking-[0.1em] text-soil uppercase">
                  <UserPlus aria-hidden size={15} /> Direct add
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-ink">Add a member</h2>
                <form className="mt-4 space-y-3" onSubmit={submitMember}>
                  <label className="block font-ui text-sm font-bold text-ink">
                    Username or email
                    <input className="mt-1 min-h-11 w-full rounded-lg border-2 border-bark bg-parchment px-3 font-ui font-normal" name="identifier" required />
                  </label>
                  <label className="block font-ui text-sm font-bold text-ink">
                    Starting role
                    <select className="mt-1 min-h-11 w-full rounded-lg border-2 border-bark bg-paper px-3 font-ui font-normal" defaultValue="editor" name="role">
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </label>
                  <ChunkyButton disabled={addMemberMutation.isPending} type="submit">
                    {addMemberMutation.isPending ? "Adding…" : "Add member"}
                  </ChunkyButton>
                </form>
              </NoteCard>
            ) : null}
          </div>
        ) : null}

        {tab === "invites" && isOwner ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <NoteCard className="rounded-xl border-3 border-bark bg-paper p-5 shadow-drop-4">
              <p className="font-micro text-[9px] tracking-[0.1em] text-soil uppercase">Invite a friend</p>
              <h2 className="mt-1 font-display text-3xl font-bold text-ink">Shareable link</h2>
              <p className="mt-2 font-ui text-sm leading-relaxed text-ink-soft">
                Invite links are multi-use and expire eight days after creation.
              </p>
              <ChunkyButton className="mt-4" disabled={createInviteMutation.isPending} onClick={() => createInviteMutation.mutate()}>
                {createInviteMutation.isPending ? "Creating…" : "Create invite"}
              </ChunkyButton>
              {createdInviteLink ? (
                <div className="mt-4 rounded-xl border-2 border-leaf bg-leaf-soft p-3">
                  <p className="break-all font-ui text-sm text-ink">{createdInviteLink}</p>
                  <button
                    className="mt-2 inline-flex min-h-11 items-center gap-2 font-display font-bold text-leaf-dark underline"
                    onClick={() => {
                      void navigator.clipboard.writeText(createdInviteLink);
                      showToast({ title: "Invite link copied", tone: "success" });
                    }}
                    type="button"
                  >
                    <Copy aria-hidden size={16} /> Copy link
                  </button>
                </div>
              ) : null}
            </NoteCard>

            <NoteCard className="rounded-xl border-3 border-bark bg-paper p-5 shadow-drop-4">
              <h2 className="font-display text-3xl font-bold text-ink">Existing links</h2>
              <div className="mt-4 space-y-2">
                {invitesQuery.data?.length ? invitesQuery.data.map((invite) => (
                  <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-sand-strong bg-parchment p-3" key={invite.id}>
                    <div>
                      <StatusBadge tone={invite.status === "active" ? "collected" : "optional"}>{invite.status}</StatusBadge>
                      <p className="mt-1 font-ui text-xs text-ink-soft">Expires {formatDate(invite.expiresAt)}</p>
                    </div>
                    {invite.status === "active" ? (
                      <button className="min-h-11 font-display font-bold text-berry underline" disabled={revokeInviteMutation.isPending} onClick={() => revokeInviteMutation.mutate(invite.id)} type="button">
                        Revoke
                      </button>
                    ) : null}
                  </div>
                )) : (
                  <p className="rounded-xl border-2 border-dashed border-sand-strong p-5 text-center font-ui text-sm text-ink-soft">No invite links yet.</p>
                )}
              </div>
            </NoteCard>
          </div>
        ) : null}

        {tab === "settings" ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {isOwner ? (
              <>
                <NoteCard className="rounded-xl border-3 border-bark bg-paper p-5 shadow-drop-4">
                  <h2 className="font-display text-3xl font-bold text-ink">Farm name</h2>
                  <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={submitRename}>
                    <input className="min-h-11 flex-1 rounded-lg border-2 border-bark bg-parchment px-3 font-ui" defaultValue={farm.name} maxLength={255} name="name" required />
                    <ChunkyButton disabled={renameMutation.isPending} type="submit">Save name</ChunkyButton>
                  </form>
                </NoteCard>
                <NoteCard className="rounded-xl border-3 border-berry bg-berry-mist p-5 shadow-drop-4">
                  <h2 className="font-display text-3xl font-bold text-berry-ink">Danger zone</h2>
                  <p className="mt-2 font-ui text-sm text-berry-ink">Deleting a farm removes it from every member&apos;s farm list.</p>
                  <ChunkyButton className="mt-4" onClick={() => { setDeleteName(""); setConfirmation({ kind: "delete" }); }} variant="danger">
                    Delete farm
                  </ChunkyButton>
                </NoteCard>
              </>
            ) : (
              <NoteCard className="max-w-xl rounded-xl border-3 border-bark bg-paper p-5 shadow-drop-4">
                <h2 className="font-display text-3xl font-bold text-ink">Your membership</h2>
                <p className="mt-2 font-ui text-sm text-ink-soft">You currently have {farm.membershipRole} access.</p>
                <ChunkyButton className="mt-4" onClick={() => setConfirmation({ kind: "leave" })} variant="danger">Leave farm</ChunkyButton>
              </NoteCard>
            )}
          </div>
        ) : null}
      </main>

      <ConfirmationDialog
        confirmation={confirmation}
        deleteName={deleteName}
        farmName={farm.name}
        pending={roleMutation.isPending || removeMutation.isPending || leaveMutation.isPending || deleteMutation.isPending}
        onCancel={() => setConfirmation(null)}
        onDeleteName={setDeleteName}
        onConfirm={() => {
          if (!confirmation) return;
          if (confirmation.kind === "transfer") roleMutation.mutate({ membershipId: confirmation.member.id, role: "owner" }, { onSuccess: () => setConfirmation(null) });
          if (confirmation.kind === "remove") removeMutation.mutate(confirmation.member.id, { onSuccess: () => setConfirmation(null) });
          if (confirmation.kind === "leave") leaveMutation.mutate();
          if (confirmation.kind === "delete") deleteMutation.mutate();
        }}
      />
    </FarmAppShell>
  );
}

function TabButton({ active, icon: Icon, onClick, children }: { active: boolean; icon: typeof Users; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={cn("inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border-2 px-4 font-display font-bold shadow-drop-2", active ? "border-bark bg-bark text-paper" : "border-sand-strong bg-paper text-ink")} onClick={onClick} type="button">
      <Icon aria-hidden size={17} /> {children}
    </button>
  );
}

function ConfirmationDialog({ confirmation, deleteName, farmName, pending, onCancel, onDeleteName, onConfirm }: { confirmation: Confirmation; deleteName: string; farmName: string; pending: boolean; onCancel: () => void; onDeleteName: (value: string) => void; onConfirm: () => void }) {
  const title = confirmation?.kind === "transfer" ? "Transfer ownership?" : confirmation?.kind === "remove" ? `Remove ${confirmation.member.username}?` : confirmation?.kind === "leave" ? `Leave ${farmName}?` : "Delete this farm?";
  const description = confirmation?.kind === "transfer" ? "You will become an editor and the selected member will control farm membership and settings." : confirmation?.kind === "remove" ? "Their active claims will be released. Collection attribution remains." : confirmation?.kind === "leave" ? "Your active claims will be released and you will lose access." : "This hides the farm from every member and cannot be undone from the app.";
  const deleteReady = confirmation?.kind !== "delete" || deleteName === farmName;
  return (
    <FarmDialog description={description} onOpenChange={(open) => { if (!open) onCancel(); }} open={Boolean(confirmation)} title={title}>
      {confirmation?.kind === "delete" ? (
        <label className="block font-ui text-sm font-bold text-ink">Type <strong>{farmName}</strong> to confirm
          <input className="mt-2 min-h-11 w-full rounded-lg border-2 border-berry bg-paper px-3 font-ui font-normal" onChange={(event) => onDeleteName(event.target.value)} value={deleteName} />
        </label>
      ) : null}
      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <ChunkyButton disabled={pending} onClick={onCancel} variant="secondary">Cancel</ChunkyButton>
        <ChunkyButton disabled={pending || !deleteReady} onClick={onConfirm} variant="danger">{pending ? "Working…" : "Confirm"}</ChunkyButton>
      </div>
    </FarmDialog>
  );
}

function CenteredMessage({ message }: { message: string }) {
  return (
    <main className="farm-canvas flex min-h-screen items-center justify-center px-5 font-ui" data-season="spring">
      <NoteCard className="rounded-xl border-3 border-bark bg-paper p-8 text-center shadow-drop-5">
        <PixelIcon name="sprout" size={36} />
        <p className="mt-3 font-display text-2xl font-bold text-ink">{message}</p>
      </NoteCard>
    </main>
  );
}
