import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Puzzle,
  FilePenLine,
  Sheet,
  Settings,
  SquareMenu,
  Users,
  UserCog,
  WifiOff,
  AlarmClock,
  Cpu,
  Fingerprint,
  Wallpaper,
  Shield,
  House,
  BellElectric,
  BrickWall,
  MonitorPlay,
  SquareLibrary,
  Camera,
  Atom,
  FlaskConical,
  Dock,
  Logs,
  AlignJustify,
  LucideProps,
} from "lucide-react";
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";

export const MENU_TYPE_MAP: Record<string, ReactNode> = {
  M: <Badge color="green">菜单</Badge>,
  D: <Badge color="blue">目录</Badge>,
};

export const STATUS: Record<string, ReactNode> = {
  1: <Badge variant="destructive">停用</Badge>,
  0: <Badge variant="outline">启用</Badge>,
};

export const MENU_ICONS: {
  name: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}[] = [
  { name: "LayoutDashboard", icon: LayoutDashboard },
  { name: "Puzzle", icon: Puzzle },
  { name: "FilePenLine", icon: FilePenLine },
  { name: "Sheet", icon: Sheet },
  { name: "Settings", icon: Settings },
  { name: "SquareMenu", icon: SquareMenu },
  { name: "Users", icon: Users },
  { name: "UserCog", icon: UserCog },
  { name: "WifiOff", icon: WifiOff },
  { name: "AlarmClock", icon: AlarmClock },
  { name: "Cpu", icon: Cpu },
  { name: "Fingerprint", icon: Fingerprint },
  { name: "Wallpaper", icon: Wallpaper },
  { name: "Shield", icon: Shield },
  { name: "House", icon: House },
  { name: "BellElectric", icon: BellElectric },
  { name: "BrickWall", icon: BrickWall },
  { name: "MonitorPlay", icon: MonitorPlay },
  { name: "SquareLibrary", icon: SquareLibrary },
  { name: "Camera", icon: Camera },
  { name: "Atom", icon: Atom },
  { name: "FlaskConical", icon: FlaskConical },
  { name: "Dock", icon: Dock },
  { name: "Logs", icon: Logs },
  { name: "AlignJustify", icon: AlignJustify },
];
