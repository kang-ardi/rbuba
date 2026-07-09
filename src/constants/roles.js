export const ROLE_OPTIONS = [
  { value: "superadmin", label: "Superadmin", rank: 1 },
  { value: "admin", label: "Admin", rank: 2 },
  { value: "siswa", label: "Siswa", rank: 3 },
];

export const ROLE_RANK = ROLE_OPTIONS.reduce((acc, role) => {
  acc[role.value] = role.rank;
  return acc;
}, {});

export const getRoleLabel = (role) => {
  return ROLE_OPTIONS.find((item) => item.value === role)?.label || role || "-";
};

export const canManageRole = (actorRole, targetRole) => {
  const actorRank = ROLE_RANK[actorRole];
  const targetRank = ROLE_RANK[targetRole];

  if (!actorRank || !targetRank) {
    return false;
  }

  return actorRank <= targetRank;
};

export const getManageableRoles = (actorRole) => {
  const actorRank = ROLE_RANK[actorRole];

  if (!actorRank) {
    return [];
  }

  return ROLE_OPTIONS.filter((role) => role.rank >= actorRank);
};
