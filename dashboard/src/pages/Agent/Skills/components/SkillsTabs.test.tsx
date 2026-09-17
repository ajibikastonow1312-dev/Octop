import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CurrentUserProvider } from "../../../../hooks/useCurrentUser";
import type { OctopUser } from "../../../../api/modules/auth";
import SkillsTabs from "./SkillsTabs";

vi.mock("../useSkills", () => ({
  useSkills: () => ({
    skills: [],
    loading: false,
    fetchSkills: vi.fn(),
    getDetail: vi.fn(),
    createSkill: vi.fn(),
    updateSkill: vi.fn(),
    importFromUrl: vi.fn(),
    importFromZip: vi.fn(),
    importing: false,
    toggleEnabled: vi.fn(),
    deleteSkill: vi.fn(),
  }),
}));

vi.mock("./InstalledSkillsTab", () => ({
  default: () => <div>installed-tab</div>,
}));

vi.mock("./SkillPackagesTab", () => ({
  default: () => <div>packages-tab</div>,
}));

vi.mock("./SkillHubTab", () => ({
  default: () => <div>hub-tab</div>,
}));

const viewer: OctopUser = {
  id: 1,
  username: "viewer",
  role: "user",
  display_name: null,
  locale: "en",
  permissions: [],
};

describe("<SkillsTabs />", () => {
  it("keeps the skill packages tab visible for agent owners without package permissions", () => {
    render(
      <CurrentUserProvider user={viewer} setUser={vi.fn()}>
        <SkillsTabs agentId="agent-1" />
      </CurrentUserProvider>,
    );

    expect(
      screen.getByRole("tab", { name: "skills.skillPackages" }),
    ).toBeInTheDocument();
  });
});
