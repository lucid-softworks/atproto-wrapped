import type { RepoRecord } from "../atproto";

export type AtGuild = {
  uri: string;
  name: string;
  leader?: string;
  memberCount: number;
  createdAt: Date | null;
};

export type AtGuildClaim = {
  uri: string;
  guildUri?: string;
  createdAt: Date | null;
};

export type AtGuildsHighlights = {
  guildsLed: number;
  guildsJoined: number;
  guilds: AtGuild[];
  claims: AtGuildClaim[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function getAtGuildsHighlights(
  byCollection: Map<string, RepoRecord[]>,
): AtGuildsHighlights | null {
  const guildRecords =
    byCollection.get("dev.jakestout.atguilds.guild") ?? [];
  if (guildRecords.length === 0) return null;

  const claimRecords =
    byCollection.get("dev.jakestout.atguilds.guildMemberClaim") ?? [];

  const guilds: AtGuild[] = guildRecords.map((r) => {
    const v = r.value;
    const members = Array.isArray(v.members) ? v.members.length : 0;
    return {
      uri: r.uri,
      name: strOrNull(v.name) ?? "Untitled guild",
      leader: strOrUndef(v.leader),
      memberCount: members,
      createdAt: r.createdAt,
    };
  });
  guilds.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const claims: AtGuildClaim[] = claimRecords.map((r) => ({
    uri: r.uri,
    guildUri: strOrUndef(r.value.guildUri),
    createdAt: r.createdAt,
  }));
  claims.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    guildsLed: guildRecords.length,
    guildsJoined: claimRecords.length,
    guilds,
    claims,
  };
}
