"use client";

import { BotIcon, VideoIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarSeparator,
  useSidebar,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
 import { Separator } from "@/components/ui/separator";
import { use } from "react";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/agents",
  },
];

const secondSection = [
  {
    icon: StarIcon,
    label: "upgrade",
    href: "/upgrade",
  },
];

export const DashboardSidebar = () => {

const pathname = usePathname();

  const sidebar = useSidebar();
  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link className="flex items-center gap-2 px-2 pt-2" href="/">
          <Image src="/logo.svg" alt="logo" width={36} height={36} />
          {/* fixed spacing issue in className */}
          <p className="text-2xl font-semibold">Meet.AI</p>
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <Separator className="opacity-10 text-[#5D6B68]" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch  hover:border-[#5D6B68] hover:bg-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to sidebar/50" ,
                      pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
         <div className="px-4 py-2">
        <Separator className="opacity-10 text-[#eef8f6]" />
      </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch  hover:border-[#5D6B68] hover:bg-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to sidebar/50" ,
                      pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
<SidebarFooter className="text-white">
 <DashboardUserButton/>
</SidebarFooter>
    </Sidebar>
  );
};
