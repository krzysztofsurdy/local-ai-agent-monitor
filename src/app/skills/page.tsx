"use client";

import { useState, useEffect, useCallback } from "react";
import { SkillCard } from "@/components/skill-card";
import { useSSE } from "@/lib/use-sse";
import type { AISkill } from "@/lib/types";

export default function SkillsPage() {
  const [skills, setSkills] = useState<AISkill[]>([]);

  const fetchSkills = useCallback(async () => {
    const res = await fetch("/api/skills");
    setSkills(await res.json());
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  useSSE((event) => {
    if (event === "fileChange") fetchSkills();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Skills</h1>
        <p className="text-foreground/50 text-sm mt-1">
          Installed plugins and skills ({skills.length})
        </p>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-16 text-foreground/40">
          <p>No skills installed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <SkillCard
              key={`${skill.name}@${skill.marketplace}`}
              name={skill.name}
              marketplace={skill.marketplace}
              version={skill.version}
              installedAt={skill.installedAt}
              scope={skill.scope}
            />
          ))}
        </div>
      )}
    </div>
  );
}
