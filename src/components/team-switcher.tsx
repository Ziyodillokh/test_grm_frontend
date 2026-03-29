import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <img src="/images/logo.png" width={30} />
          <h3 className="grid flex-1 text-left text-xl leading-tight">grm</h3>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
