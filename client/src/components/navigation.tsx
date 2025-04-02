import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  HeartHandshake,
  HandshakeIcon,
  Shield,
  Users,
  Menu,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Briefcase,
  Heart,
  Activity,
  GraduationCap,
  AlertCircle,
  Home,
  Sparkles
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

const defaultNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/why-fundamenta", label: "Why Fundamenta", icon: Sparkles },
  { href: "/partner", label: "Partner With Us", icon: HandshakeIcon },
  { href: "/privacy", label: "Privacy Hub", icon: Shield },
  { href: "/invite", label: "Invite Friends", icon: Users },
];

const featureNavItems = [
  { href: "/learning", label: "Life Skills", icon: GraduationCap },
  { href: "/finance", label: "Financial Literacy", icon: DollarSign },
  { href: "/career", label: "Career Development", icon: Briefcase },
  { href: "/wellness", label: "Wellness & Nutrition", icon: Heart },
  { href: "/active", label: "Active You", icon: Activity },
  { href: "/emergency", label: "Emergency Guidance", icon: AlertCircle },
];

export default function Navigation() {
  const [location, navigate] = useLocation();
  const isMobile = useIsMobile();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isHomePage = location === "/" || location === "/home";
  
  // On home page, show only default items (Why Fundamenta, Partner, Privacy, Invite)
  // On other pages, show feature items (Life Skills, Financial Literacy, etc.)
  // Filter out the current page from navigation items
  const displayedNavItems = isHomePage
    ? [...defaultNavItems.filter(item => item.href !== "/")] 
    : [...featureNavItems].filter(item => item.href !== location);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      isMinimized ? '5rem' : '16rem'
    );
    document.body.classList.toggle('sidebar-minimized', isMinimized);
  }, [isMinimized]);

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  // Modern styling with our new theme colors
  const navBgColor = "bg-white";
  const navTextColor = "text-gray-700";
  const activeItemBg = "bg-rose-100";
  const activeItemText = "text-rose-700";
  const hoverBg = "hover:bg-rose-50";
  const logoText = "text-gray-800";

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="fixed top-4 left-4 z-50 bg-white border-rose-300 text-gray-700 hover:bg-rose-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={`${navBgColor} border-r border-rose-300 shadow-md`}>
          <button 
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-2 px-2 py-6 mb-6 w-full hover:bg-rose-50 rounded-md transition-colors"
          >
            <div className="h-8 w-8 bg-rose-500 rounded-md flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${logoText}`}>Fundamenta</span>
          </button>
          
          <div className="flex flex-col gap-1">
            {/* Display navigation items based on current page */}
            {displayedNavItems.map(({ href, label, icon: Icon }) => (
              <button
                key={href}
                onClick={() => handleNavigation(href)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left",
                  location === href
                    ? `${activeItemBg} ${activeItemText}`
                    : `${navTextColor} ${hoverBg}`
                )}
              >
                <Icon className={cn("h-5 w-5", location === href ? "text-rose-700" : "text-gray-600")} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className={cn(
      "fixed left-0 top-0 h-screen border-r border-rose-300 p-4 transition-all duration-300 z-50 shadow-lg",
      navBgColor,
      isMinimized ? "w-16" : "w-64"
    )}>
      <div className="relative mb-8">
        <button 
          onClick={() => handleNavigation("/")}
          className={cn(
            "flex items-center gap-3 px-2 py-4 w-full text-left rounded-md transition-colors",
            logoText,
            "hover:bg-rose-50 cursor-pointer"
          )}
        >
          <div className="h-8 w-8 bg-rose-500 rounded-md flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!isMinimized && <span className="text-lg font-bold">Fundamenta</span>}
        </button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute top-3 -right-2 text-gray-700 hover:text-gray-800 hover:bg-rose-50 bg-white border border-rose-300"
        >
          {isMinimized ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        {/* Display navigation items based on current page */}
        {displayedNavItems.map(({ href, label, icon: Icon }) => (
          <button
            key={href}
            onClick={() => handleNavigation(href)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left",
              location === href
                ? `${activeItemBg} ${activeItemText}`
                : `${navTextColor} ${hoverBg}`
            )}
            title={isMinimized ? label : undefined}
          >
            <Icon className={cn("h-5 w-5", location === href ? "text-rose-700" : "text-gray-600")} />
            {!isMinimized && <span className="font-medium">{label}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}