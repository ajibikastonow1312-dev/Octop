import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CurrentUserProvider } from "../../../../hooks/useCurrentUser";
import type { OctopUser } from "../../../../api/modules/auth";
import InstalledSkillsTab from "./InstalledSkillsTab";

vi.mock("../../../../context/AgentContext", () => ({
  useAgent: () => ({
    agents: [{ agent_id: "agent-1", state: "running" }],
  }),
}));

vi.mock("../../../../hooks/useCardTableView", () => ({
  useCardTableView: () => ({
    viewMode: "card",
    setViewMode: vi.fn(),
    showCardView: true,
  }),
}));

vi.mock("../../../../components/Skeleton", () => ({
  CardSkeleton: () => <div>skeleton</div>,
}));

vi.mock("../../../../components/EmptyState", () => ({
  EmptyState: () => <div>empty-state</div>,
}));

vi.mock("./SkillCard", () => ({
  SkillCard: () => <div>skill-card</div>,
}));

vi.mock("./SkillImportModal", () => ({
  SkillImportModal: () => null,
}));

vi.mock("./PushSkillToPackageModal", () => ({
  PushSkillToPackageModal: () => null,
}));

vi.mock("./SkillsTable", () => ({
  default: () => <div>skills-table</div>,
}));

vi.mock("./SkillDrawer", () => ({
  SkillDrawer: ({
    onPushToPackage,
  }: {
    onPushToPackage?: ((skill: unknown) => void) | undefined;
  }) => (
    <div data-testid="push-to-package-enabled">
      {String(Boolean(onPushToPackage))}
    </div>
  ),
}));

const viewer: OctopUser = {
  id: 1,
  username: "viewer",
  role: "user",
  display_name: null,
  locale: "en",
  permissions: [],
};

describe("<InstalledSkillsTab />", () => {
  it("hides push-to-package actions without skill package permission", () => {
    render(
      <CurrentUserProvider user={viewer} setUser={vi.fn()}>
        <InstalledSkillsTab
          kind="custom"
          agentId="agent-1"
          skills={[
            {
              slug: "hello",
              name: "Hello",
              description: "",
              enabled: true,
              kind: "workspace",
            },
          ]}
          loading={false}
          fetchSkills={vi.fn()}
          getDetail={vi.fn()}
          createSkill={vi.fn()}
          updateSkill={vi.fn()}
          importFromUrl={vi.fn()}
          importFromZip={vi.fn()}
          importing={false}
          toggleEnabled={vi.fn()}
          deleteSkill={vi.fn()}
        />
      </CurrentUserProvider>,
    );

    expect(screen.getByTestId("push-to-package-enabled")).toHaveTextContent(
      "false",
    );
  });
});
