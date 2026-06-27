/**
 * Seeded demo history for Momentum OS (slice 1 renders from this).
 *
 * IMPORTANT: this is fictional, non-sensitive sample data. It contains no real
 * client, employer, financial, or health information. See SECURITY_AND_PRIVACY.md.
 *
 * The seed is deliberately tuned so the longitudinal "self-record" signals are
 * visibly interesting on day one (e.g. a priority that has slipped several days,
 * a neglected compounding action), so the confrontation mechanic can be evaluated
 * without first accumulating two weeks of real entries.
 *
 * Sorted ASCENDING by date (oldest first), as the signals engine expects.
 */

import type { DailyEntry, WeeklyCommitment } from "@/lib/types";

export const mockHistory: DailyEntry[] = [
  // ---- previous week (context only; outside the 7-day signal windows) ----
  {
    date: "2026-06-13",
    keystone: "Ship the aviation network review draft",
    keystoneProtected: true,
    notDoing: "Not touching the retail benchmarking side-quest today",
    priorities: [
      { id: "net-draft", title: "Aviation network review draft", done: true },
      { id: "1on1", title: "Prep skip-level 1:1", done: true },
    ],
    compoundingAction: "Read 1 RM pricing paper (15m)",
    energy: 4,
  },
  {
    date: "2026-06-14",
    keystone: "Recover — deliberate light day",
    keystoneProtected: true,
    notDoing: "No deck work on a Sunday",
    priorities: [{ id: "mobility", title: "Mobility + zone-2 walk", done: true }],
    energy: 3,
  },
  {
    date: "2026-06-15",
    keystone: "Lock the steerco storyline",
    keystoneProtected: false,
    notDoing: "Declining the optional vendor demo",
    priorities: [
      { id: "storyline", title: "Steerco storyline", done: false },
      { id: "inbox", title: "Inbox triage", done: true },
    ],
    leverage: { kind: "irreversible_decision", note: "Chose scope cut over deadline slip" },
    energy: 3,
  },
  {
    date: "2026-06-16",
    keystone: "Steerco storyline, take two",
    keystoneProtected: true,
    notDoing: "Not rebuilding the model from scratch",
    priorities: [
      { id: "storyline", title: "Steerco storyline", done: true },
      { id: "hiit", title: "HIIT session", done: true },
    ],
    compoundingAction: "Wrote 250 words on exec-presence note",
    energy: 4,
  },
  {
    date: "2026-06-17",
    keystone: "Deliver steerco",
    keystoneProtected: true,
    notDoing: "No new workstreams accepted mid-week",
    priorities: [
      { id: "steerco", title: "Run steerco", done: true },
      { id: "followups", title: "Capture decisions + owners", done: true },
    ],
    leverage: { kind: "reusable_ip", note: "Templatized the decision log" },
    energy: 3,
  },
  {
    date: "2026-06-18",
    keystone: "Convert steerco into a workplan",
    keystoneProtected: false,
    notDoing: "Not polishing slides nobody asked for",
    priorities: [
      { id: "workplan", title: "Draft 2-week workplan", done: false },
      { id: "calisthenics", title: "Calisthenics pull session", done: true },
    ],
    energy: 2,
  },
  {
    date: "2026-06-19",
    keystone: "Finish the workplan",
    keystoneProtected: true,
    notDoing: "Saying no to the Friday status call",
    priorities: [
      { id: "workplan", title: "Draft 2-week workplan", done: true },
    ],
    compoundingAction: "Read retail trends brief (20m)",
    energy: 3,
  },

  // ---- current 7-day window (drives the self-record strip) ----
  {
    date: "2026-06-20",
    keystone: "Personal project: ship Momentum OS spec",
    keystoneProtected: true,
    notDoing: "Not opening the work laptop on Saturday",
    priorities: [
      { id: "momentum-spec", title: "Momentum OS one-page spec", done: true },
      { id: "longrun", title: "Long zone-2 run", done: true },
    ],
    energy: 4,
  },
  {
    date: "2026-06-21",
    keystone: "Rest + read",
    keystoneProtected: false,
    notDoing: "No deck work; protecting recovery",
    priorities: [
      { id: "read", title: "Read 30 pages", done: true },
    ],
    compoundingAction: "Read RM elasticity chapter (30m)",
    energy: 3,
  },
  {
    date: "2026-06-22",
    keystone: "Kick off the RM pricing model deck",
    keystoneProtected: true,
    notDoing: "Not answering non-urgent Slack until 2pm",
    priorities: [
      { id: "rm-deck", title: "Finish RM pricing model deck", done: false },
      { id: "hiring", title: "Review 2 candidate profiles", done: true },
    ],
    leverage: { kind: "irreversible_decision", note: "Committed to a single pricing narrative" },
    energy: 4,
  },
  {
    date: "2026-06-23",
    keystone: "RM pricing model deck — core slides",
    keystoneProtected: false,
    notDoing: "",
    priorities: [
      { id: "rm-deck", title: "Finish RM pricing model deck", done: false, carriedFromDate: "2026-06-22" },
      { id: "standup", title: "Run team standup", done: true },
      { id: "inbox", title: "Inbox to zero", done: false },
    ],
    energy: 2,
  },
  {
    date: "2026-06-24",
    keystone: "RM pricing model deck — finish core",
    keystoneProtected: false,
    notDoing: "",
    priorities: [
      { id: "rm-deck", title: "Finish RM pricing model deck", done: false, carriedFromDate: "2026-06-22" },
      { id: "review", title: "Review analyst model", done: true },
    ],
    energy: 2,
  },
  {
    date: "2026-06-25",
    keystone: "RM pricing model deck — narrative pass",
    keystoneProtected: true,
    notDoing: "Declining a same-day intro call",
    priorities: [
      { id: "rm-deck", title: "Finish RM pricing model deck", done: false, carriedFromDate: "2026-06-22" },
      { id: "calisthenics", title: "Calisthenics push session", done: true },
    ],
    leverage: { kind: "senior_time_on_junior_work", note: "Spent 2h reformatting slides — should delegate" },
    energy: 3,
  },
  {
    // today — end-of-day question not answered yet (keystoneProtected: undefined)
    date: "2026-06-26",
    keystone: "RM pricing model deck — finish and send",
    notDoing: "Not starting the new retail proposal until this ships",
    priorities: [
      { id: "rm-deck", title: "Finish RM pricing model deck", done: false, carriedFromDate: "2026-06-22" },
      { id: "weekly-review", title: "Do the weekly review", done: false },
    ],
    leverage: { kind: "reusable_ip" },
    energy: 3,
  },
];

/** Today = the most recent entry (the deck plans the current day). */
export const today: DailyEntry = mockHistory[mockHistory.length - 1];

/** Last week's single behavioral commitment — surfaced (carried forward) in the weekly review (later slice). */
export const lastWeekCommitment: WeeklyCommitment = {
  weekOf: "2026-06-15",
  commitment: "Protect a 90-minute deep-work block before 11am, no Slack.",
  outcome: "partial",
  outcomeNote: "Held it 3 of 5 weekdays; collapsed on steerco days.",
};
