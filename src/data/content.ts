export type Slot = {
  id: string;
  day: string;
  period: "Evening" | "Morning" | "Mid-day";
  time: string;
  entry: "open" | "referral";
};

export type Track = {
  id: "A" | "B";
  label: string;
  days: string;
  blurb: string;
  slots: Slot[];
};

export const tracks: Track[] = [
  {
    id: "A",
    label: "Track A",
    days: "Monday & Wednesday",
    blurb: "Evening sessions for dads who work days. 6:00 – 7:30 PM, 90 minutes.",
    slots: [
      { id: "mon-eve", day: "Monday", period: "Evening", time: "6:00 PM – 7:30 PM", entry: "open" },
      { id: "wed-eve", day: "Wednesday", period: "Evening", time: "6:00 PM – 7:30 PM", entry: "open" },
    ],
  },
  {
    id: "B",
    label: "Track B",
    days: "Tuesday & Thursday",
    blurb: "Two daytime windows each day. One hour, morning or mid-day.",
    slots: [
      { id: "tue-am", day: "Tuesday", period: "Morning", time: "8:30 AM – 9:30 AM", entry: "open" },
      { id: "tue-mid", day: "Tuesday", period: "Mid-day", time: "11:00 AM – 12:00 PM", entry: "referral" },
      { id: "thu-am", day: "Thursday", period: "Morning", time: "8:30 AM – 9:30 AM", entry: "open" },
      { id: "thu-mid", day: "Thursday", period: "Mid-day", time: "11:00 AM – 12:00 PM", entry: "referral" },
    ],
  },
];

export const allSlots = tracks.flatMap((t) => t.slots.map((s) => ({ ...s, track: t.id })));

export const highlights = [
  { title: "12-Week Cohort", note: "One steady group, start to finish" },
  { title: "Hosted at the YWCA", note: "6501 University Ave, Lubbock" },
  { title: "Childcare Support Available", note: "Bring the kids, we have you covered" },
  { title: "1 to 1.5 Hour Sessions", note: "Fits around a work shift" },
];

export const contact = {
  name: "Tyson Bethany",
  role: "YWCA Fatherhood Director",
  email: "tyson.bethany@ywcalubbock.org",
  address: "6501 University Avenue",
  site: "ywcalubbock.org",
};

export const testimonials = [
  {
    quote:
      "I used to leave the room when my son got loud. Week four, I learned to get down on his level and just listen. He climbs in my lap now.",
    who: "Graduate dad",
    meta: "Reflection, week 12",
    kind: "Graduate reflection",
  },
  {
    quote: "Nobody here is perfect and nobody pretends to be. That is why it works.",
    who: "Cohort member",
    meta: "Group discussion",
    kind: "Group discussion",
  },
  {
    quote:
      "Showing up on time, every Wednesday, became the thing my daughter could count on. She noticed before I did.",
    who: "Graduate dad",
    meta: "Reflection, week 12",
    kind: "Graduate reflection",
  },
  {
    quote:
      "Cohort summary: every dad completed the check-in on co-parenting communication, and most said they now plan one-on-one time each week.",
    who: "Facilitator notes",
    meta: "Cohort success summary",
    kind: "Cohort summary",
  },
  {
    quote: "Childcare in the next room meant I could actually focus. First time I heard other dads say what I was thinking.",
    who: "Graduate dad",
    meta: "Reflection, week 8",
    kind: "Graduate reflection",
  },
  {
    quote: "We talked about what we got from our own fathers, what to keep, and what to leave behind.",
    who: "Cohort member",
    meta: "Group discussion",
    kind: "Group discussion",
  },
];

export type Resource = {
  id: string;
  title: string;
  type: "Flyer" | "Pamphlet" | "Tip sheet";
  pages: string;
  excerpt: string;
  provides: string[];
  href?: string;
  thumb: "flyer" | "navy" | "orange" | "gold";
};

export const resources: Resource[] = [
  {
    id: "program-flyer",
    title: "Fatherhood Initiative Program Flyer",
    type: "Flyer",
    pages: "1 page",
    excerpt:
      "The current flyer with program dates, session times, location, and contact info. Print it, post it, or text it to a dad you know.",
    provides: ["Weekly schedule", "Childcare info", "Contact details"],
    href: "flyer",
    thumb: "flyer",
  },
  {
    id: "247-dad-overview",
    title: "24/7 Dad Curriculum Overview",
    type: "Pamphlet",
    pages: "Request a copy",
    excerpt:
      "What each of the 12 weeks covers, based on the 24/7 Dad curriculum and led by the Fatherhood Director with a Childhood Specialist.",
    provides: ["Week-by-week topics", "What to expect", "Homework ideas"],
    thumb: "navy",
  },
  {
    id: "conversation-starters",
    title: "Dinner Table Conversation Starters",
    type: "Tip sheet",
    pages: "Request a copy",
    excerpt: "Quick questions to open up talk with kids of different ages, from toddlers to teens.",
    provides: ["Age-based prompts", "Listening tips"],
    thumb: "orange",
  },
  {
    id: "referral-guide",
    title: "How to Refer a Dad",
    type: "Pamphlet",
    pages: "Request a copy",
    excerpt:
      "A one-page guide for caseworkers, teachers, clergy, and friends on how to refer a father and what happens after.",
    provides: ["Referral steps", "Intake timeline", "Who to call"],
    thumb: "gold",
  },
];

export type ZoomGroup = {
  id: string;
  name: string;
  host: string;
  day: number;
  startMin: number;
  endMin: number;
  label: string;
  url: string;
  focus: string;
};

export const zoomGroups: ZoomGroup[] = [
  { id: "mon-eve", name: "Monday Evening Dads", host: "Tyson Bethany", day: 1, startMin: 1080, endMin: 1170, label: "Mon 6:00 PM", url: "https://zoom.us/j/0000000001", focus: "Track A" },
  { id: "tue-am", name: "Tuesday Morning Dads", host: "Tyson Bethany", day: 2, startMin: 510, endMin: 570, label: "Tue 8:30 AM", url: "https://zoom.us/j/0000000002", focus: "Track B" },
  { id: "tue-mid", name: "Tuesday Mid-day Dads", host: "Tyson Bethany", day: 2, startMin: 660, endMin: 720, label: "Tue 11:00 AM", url: "https://zoom.us/j/0000000003", focus: "Track B" },
  { id: "wed-eve", name: "Wednesday Evening Dads", host: "Tyson Bethany", day: 3, startMin: 1080, endMin: 1170, label: "Wed 6:00 PM", url: "https://zoom.us/j/0000000004", focus: "Track A" },
  { id: "thu-am", name: "Thursday Morning Dads", host: "Tyson Bethany", day: 4, startMin: 510, endMin: 570, label: "Thu 8:30 AM", url: "https://zoom.us/j/0000000005", focus: "Track B" },
  { id: "thu-mid", name: "Thursday Mid-day Dads", host: "Tyson Bethany", day: 4, startMin: 660, endMin: 720, label: "Thu 11:00 AM", url: "https://zoom.us/j/0000000006", focus: "Track B" },
];
