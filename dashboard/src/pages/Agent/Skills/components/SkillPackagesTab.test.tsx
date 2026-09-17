import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CurrentUserProvider } from "../../../../hooks/useCurrentUser";
import type { OctopUser } from "../../../../api/modules/auth";
import SkillPackagesTab from "./SkillPackagesTab";

const list = vi.fn();
const listMounted = vi.fn();

vi.mock("../../../../api/modules/skillPackages", () => ({
  skillPackagesApi: {
    list: () => list(),
    listMounted: (agentId: string) => listMounted(agentId),
    get: vi.fn(),
    replaceMounted: vi.fn(),
    copyToWorkspace: vi.fn(),
  },
}));

vi.mock("../../../../context/AgentContext", () => ({
  useAgent: () => ({
    agents: [{ agent_id: "agent-1", config: {} }],
  }),
}));

vi.mock("../../../Experts/components/agentBackendForm", () => ({
  supportsHostSkillPackagesFromConfig: () => true,
}));

vi.mock("../../../SkillPackages/PackageIcon", () => ({
  PackageIcon: () => <div>icon</div>,
}));

const viewer: OctopUser = {
  id: 1,
  username: "viewer",
  role: "user",
  display_name: null,
  locale: "en",
  permissions: [],
};

describe("<SkillPackagesTab />", () => {
  it("keeps mount controls visible but hides copy actions without permission", async () => {
    list.mockResolvedValue([
      {
        id: "pkg-1",
        name: "Package One",
        description: "desc",
        skill_count: 1,
      },
    ]);
    listMounted.mockResolvedValue({ package_ids: [] });

    render(
      <CurrentUserProvider user={viewer} setUser={vi.fn()}>
        <SkillPackagesTab
          agentId="agent-1"
          skills={[]}
          fetchSkills={vi.fn()}
          toggleEnabled={vi.fn()}
        />
      </CurrentUserProvider>,
    );

    await screen.findByText("Package One");
    expect(screen.getByRole("switch")).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "skills.copySkills" }),
      ).not.toBeInTheDocument();
    });
  });
});
