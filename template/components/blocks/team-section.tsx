import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/cn";
import { safeHref } from "@/lib/utils/strings";
import { XIcon, BriefcaseBusiness, Code2, Mail } from "lucide-react";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return (parts[0]?.[0] ?? "?").toUpperCase();
  return ((parts.at(0)?.[0] ?? "") + (parts.at(-1)?.[0] ?? "")).toUpperCase();
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

// ============================================================================
// TEAM VARIANT 1: Grid with Cards
// ============================================================================
export interface TeamGridProps {
  title?: string;
  subtitle?: string;
  description?: string;
  members: TeamMember[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function TeamGrid({
  title,
  subtitle,
  description,
  members,
  columns = 4,
  className,
}: TeamGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-7xl">
        {(title || subtitle || description) && (
          <div className="mb-12 space-y-4 text-center">
            {subtitle && (
              <p className="text-sm font-bold tracking-widest text-primary uppercase">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-black tracking-tight uppercase md:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div className={cn("grid gap-6", gridCols[columns])}>
          {members.map((member) => (
            <Card
              key={`team-${member.name}`}
              className="group transition hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]"
            >
              <CardContent className="space-y-4 p-6 text-center">
                <Avatar className="mx-auto h-24 w-24 border-3 border-foreground shadow-[4px_4px_0px_hsl(var(--shadow-color))]">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-2xl font-bold">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="text-lg font-black uppercase">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">
                    {member.role}
                  </p>
                </div>

                {member.bio && (
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                )}

                {member.social && (
                  <div className="flex justify-center gap-2">
                    {member.social.twitter && (
                      <SocialLink
                        href={member.social.twitter}
                        icon={<XIcon className="h-4 w-4" />}
                      />
                    )}
                    {member.social.linkedin && (
                      <SocialLink
                        href={member.social.linkedin}
                        icon={<BriefcaseBusiness className="h-4 w-4" />}
                      />
                    )}
                    {member.social.github && (
                      <SocialLink
                        href={member.social.github}
                        icon={<Code2 className="h-4 w-4" />}
                      />
                    )}
                    {member.social.email && (
                      <SocialLink
                        href={`mailto:${member.social.email}`}
                        icon={<Mail className="h-4 w-4" />}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TEAM VARIANT 2: Simple List
// ============================================================================
export interface TeamListProps {
  title?: string;
  members: TeamMember[];
  className?: string;
}

export function TeamList({ title, members, className }: TeamListProps) {
  return (
    <section
      className={cn("bg-muted/30 px-4 py-16 md:px-8 lg:px-16", className)}
    >
      <div className="mx-auto max-w-4xl">
        {title && (
          <h2 className="mb-12 text-center text-3xl font-black tracking-tight uppercase md:text-4xl">
            {title}
          </h2>
        )}

        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={`team-${member.name}`}
              className="flex items-center gap-4 border-3 border-foreground bg-card p-4 shadow-[4px_4px_0px_hsl(var(--shadow-color))] transition hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]"
            >
              <Avatar className="h-16 w-16 border-2 border-foreground">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="font-bold">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="font-black uppercase">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>

              {member.social && (
                <div className="flex gap-2">
                  {member.social.twitter && (
                    <SocialLink
                      href={member.social.twitter}
                      icon={<XIcon className="h-4 w-4" />}
                    />
                  )}
                  {member.social.linkedin && (
                    <SocialLink
                      href={member.social.linkedin}
                      icon={<BriefcaseBusiness className="h-4 w-4" />}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TEAM VARIANT 3: With Large Photos
// ============================================================================
export interface TeamLargePhotosProps {
  title?: string;
  subtitle?: string;
  members: TeamMember[];
  className?: string;
}

export function TeamLargePhotos({
  title,
  subtitle,
  members,
  className,
}: TeamLargePhotosProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mb-12 space-y-2 text-center">
            {subtitle && (
              <p className="text-sm font-bold tracking-widest text-secondary uppercase">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-black tracking-tight uppercase md:text-4xl">
                {title}
              </h2>
            )}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div key={`team-${member.name}`} className="group">
              <div className="relative mb-4 overflow-hidden border-3 border-foreground shadow-[6px_6px_0px_hsl(var(--shadow-color))] transition group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    height={640}
                    unoptimized
                    width={640}
                    className="h-80 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-80 w-full items-center justify-center bg-muted">
                    <span className="text-6xl font-black text-muted-foreground">
                      {getInitials(member.name)}
                    </span>
                  </div>
                )}

                {member.social && (
                  <div
                    aria-hidden="true"
                    className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-foreground/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <div className="flex justify-center gap-2">
                      {member.social.twitter && (
                        <SocialLink
                          href={member.social.twitter}
                          icon={<XIcon className="h-4 w-4" />}
                          light
                          tabIndex={-1}
                        />
                      )}
                      {member.social.linkedin && (
                        <SocialLink
                          href={member.social.linkedin}
                          icon={<BriefcaseBusiness className="h-4 w-4" />}
                          light
                          tabIndex={-1}
                        />
                      )}
                      {member.social.github && (
                        <SocialLink
                          href={member.social.github}
                          icon={<Code2 className="h-4 w-4" />}
                          light
                          tabIndex={-1}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-black uppercase">{member.name}</h3>
              <p className="font-medium text-muted-foreground">{member.role}</p>
              {member.bio && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TEAM VARIANT 4: Compact Avatars
// ============================================================================
export interface TeamCompactProps {
  title?: string;
  description?: string;
  members: TeamMember[];
  className?: string;
}

export function TeamCompact({
  title,
  description,
  members,
  className,
}: TeamCompactProps) {
  return (
    <section className={cn("px-4 py-16 md:px-8 lg:px-16", className)}>
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        {(title || description) && (
          <div className="space-y-4">
            {title && (
              <h2 className="text-2xl font-black tracking-tight uppercase md:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="font-medium text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-6">
          {members.map((member) => (
            <div key={`team-${member.name}`} className="text-center">
              <Avatar className="mx-auto mb-2 h-20 w-20 border-3 border-foreground shadow-[3px_3px_0px_hsl(var(--shadow-color))]">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="text-lg font-bold">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-bold">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Helper Components
// ============================================================================
function SocialLink({
  href,
  icon,
  light = false,
  tabIndex,
}: {
  href: string;
  icon: React.ReactNode;
  light?: boolean;
  tabIndex?: number;
}) {
  return (
    <a
      href={safeHref(href)}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={tabIndex}
      className={cn(
        "flex h-8 w-8 items-center justify-center border-2 border-foreground transition hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_hsl(var(--shadow-color))]",
        light
          ? "bg-background text-foreground"
          : "bg-muted hover:bg-primary hover:text-primary-foreground",
      )}
    >
      {icon}
    </a>
  );
}

// ============================================================================
// Export all variants
// ============================================================================
export const TeamSection = {
  Grid: TeamGrid,
  List: TeamList,
  LargePhotos: TeamLargePhotos,
  Compact: TeamCompact,
};
