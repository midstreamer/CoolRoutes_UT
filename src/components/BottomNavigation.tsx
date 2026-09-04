import type { AppTab } from "../types/navigation";

interface BottomNavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const tabs: { id: AppTab; label: string; icon: string }[] = [
  { id: "route", label: "Home", icon: "home" },
  { id: "schedule", label: "My Schedule", icon: "calendar" },
  { id: "cooling", label: "Cooling Stops", icon: "bookmark" },
  { id: "about", label: "More", icon: "person" }
];

export const BottomNavigation = ({
  activeTab,
  onTabChange
}: BottomNavigationProps) => (
  <nav className="bottom-nav" aria-label="Primary navigation">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        className={activeTab === tab.id ? "active" : ""}
        aria-current={activeTab === tab.id ? "page" : undefined}
        onClick={() => onTabChange(tab.id)}
      >
        <span className={`nav-icon ${tab.icon}`} aria-hidden="true" />
        {tab.label}
      </button>
    ))}
  </nav>
);
