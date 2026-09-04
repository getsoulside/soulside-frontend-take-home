# Soulside — Frontend Engineer Take-Home

Thanks for spending time on this. Please read the whole thing before you start; the framing
matters more than the requirements.

## The short version

|                    |                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **Time**           | **8 hours, hard cap.** Please stop at 8.                                                         |
| **Deadline**       | 5 calendar days from when you receive this. Need more? Just ask.                                 |
| **Stack**          | The starter repo: React + TypeScript + Vite + Tailwind.                                          |
| **Deliverables**   | A link to your repo + a README with specific sections + a video under 5 minutes.                 |
| **AI**             | Use it. Tell us where. Read the AI section below before you decide how much.                     |
| **Our commitment** | A decision within 3 business days of your submission, with specific written feedback either way. |

**We are not scoring completeness.** The task is deliberately bigger than 8 hours. We are
scoring the decisions you made, the things you chose _not_ to do, and how well you can explain
both. A submission that does three things thoughtfully will beat one that does ten things
shallowly — that is not a consolation prize, it is genuinely how we score this.

---

## The scenario

Maya Reddy (she/her) is a licensed therapist at a 12-clinician outpatient behavioral health
clinic. She carries about 35 active clients. She sees 6–7 of them a day, back to back, with
10-minute gaps.

It's Monday, 8:40am. Her first session is at 9:00. She has twenty minutes and a coffee.

What she wants to know is: **who needs me this week?**

Right now the only way to answer that is to open clients one at a time and read back through
their notes. She has 35 clients and twenty minutes, so what actually happens is that she
remembers the three clients she's worried about, deals with them, and everyone else surfaces
whenever they surface — sometimes late.

**Your job: build the screen Maya opens on Monday morning.**

## What we are deliberately not telling you

- What "needs attention" means.
- What the screen looks like.
- What to do about data that doesn't make sense.

Those are the assignment. This is what the job is actually like: you will regularly get a
problem in roughly this much detail and be expected to come back with a product, not with
questions. We want to see where _you_ land, and we want your submission to look different from
everybody else's.

There is no answer key. There are better and worse justifications.

## What you're given

The starter repo contains a small mock API of the clinic's back office. It is not a nice API.
It is roughly as nice as the real ones you'll integrate against here.

- `GET /api/clients` — Maya's client roster.
- `GET /api/records?cursor=&limit=` — cursor-paginated clinical records.

It requires an auth header, it is slow and variable, it fails sometimes, and the records come
in more than one shape. Setup instructions and an API reference are in `STARTER.md`.

You also have access to an LLM API (free tiers, no credit card — see the appendix). **We expect
you to use it somewhere that matters.** The records are unstructured English written by busy
humans; the interesting decisions in this assignment are about what you extract from that, how
much you trust it, and how you present something probabilistic to a professional who is
accountable for the outcome. Using an LLM to make a colour badge is not that.

## Things you might consider

**This list is longer than 8 hours. Choosing from it is the assignment.** Pick what you believe
matters most for Maya at 8:40am on a Monday, and leave the rest — we'd much rather read a clear
explanation of why you skipped something than see a half-built version of it.

1. What "needs attention" means, and whether it is one number, several signals, or neither.
2. How Maya scans 35 clients in the ninety seconds she'll actually give this screen.
3. What she does next — is this screen a destination, or the start of an action?
4. Records that are junk, empty, or malformed.
5. Clients with no records at all. There are some, and they may be the most interesting ones.
6. Records missing dates, or with dates you can't fully trust.
7. Whether Maya can disagree with the system, and what happens when she does.
8. How much she should trust an LLM-derived signal, and how the interface communicates that.
9. What the screen does while data is still loading — this API is genuinely slow.
10. What the screen does when the API fails, and what Maya sees.
11. LLM rate limits and token limits on free tiers. They are real and you will hit them.
12. Whether any of this needs to survive a page refresh.
13. What happens the second Monday, when she's already triaged everyone once.
14. Keyboard flow, if you think that's where the value is.

## Deliverables

**1. A private repo, with `uttamsdarji` added as a collaborator.**

Use **"Use this template" → "Create a new repository"** and set the visibility to **Private** —
you can do that even though this template is public, and private repos allow unlimited
collaborators on free accounts. Please don't fork: forks of a public repo are always public and
stay listed on our Forks tab, visible to other candidates.

Keep the starter files and `ASSIGNMENT.md` in place and commit your work alongside them, so it's
all in one place. Don't commit your `.env`.

Private is so we can keep reusing the exercise. Happy for you to make it public for your
portfolio once you've heard back — just let us know.

**2. A `README.md` at the repo root** with exactly these sections:

- **How to run it.** `STARTER.md` covers the base setup — here, just tell us anything you
  changed or added: extra env vars, extra commands, which LLM provider you used.
- **What I built and why.** Your read on Maya's problem, and the product you chose.
- **What I decided not to build, and why.** Be specific and unapologetic. This is the section
  we read most closely.
- **Where the data fought back.** What you found in the data that the brief didn't mention, and
  what you did about it.
- **How I used AI.** Which tools, on what, and anything you rejected or rewrote.
- **Scaling.** ~250 words: this works for 35 clients and one clinician. What breaks at 5,000
  clients across 200 clinicians, with three people editing the same record at once? What would
  you change, and — just as important — what would you keep exactly as it is?
- **With two more weeks.** The three things you'd do next, in order.

**3. A video, under 5 minutes** (Loom, or anything with a shareable link). Unedited and unpolished
is completely fine — we are not judging production values. Cover:

- A quick demo of the thing working.
- A 60-second tour of how the code is organised and why.
- One decision you're not sure about, and what would change your mind.

## On AI

Use whatever you use at work. We do too, all day. Tell us where and how in the README — we're
asking because we're interested in how you work, not because we're policing you.

One thing to weigh, honestly and in your interest: **if we move forward, the next round includes
extending this codebase live, with no preparation, in about twenty minutes.** AI allowed there
too. So submit code you can navigate and change under time pressure. Anything you shipped
without understanding will be visible in that session within about three minutes, and that's an
awkward way to spend an hour for both of us.

## Ground rules

- **Ask us questions.** Email `uttam@soulside.ai`. We'll answer anything factual or blocking
  quickly — setup, keys, deadlines, scope of the deliverables. Product questions ("should the
  list be sorted by risk?") we will mostly bounce back to you with "your call, tell us your
  reasoning" — not to be difficult, but because that judgment is what we're hiring for. The
  questions you choose to ask are something we pay attention to, in a good way.
- **Stop at 8 hours.** If you're at 8 hours with three things half-built, commit it, write up
  where you got to and what you'd do next, and send it. That is a completely valid submission
  and we will read it as one. Going to 20 hours will not help you — we do a rough sanity check
  on scope versus claimed effort, because we want this to be fair to people with jobs.
- **Any libraries you like.** Add whatever you'd add at work. Tell us why in the README if it's
  a load-bearing choice.
- **Don't build a backend.** The mock API is your backend. If you need to persist something,
  anything from `localStorage` upward is fine — just be deliberate.
- **Don't spend your time on auth, tests-for-coverage's-sake, or a design system.** None of
  those are being scored. Tests for the one or two things you consider genuinely risky are
  welcome, but optional.

## How we'll evaluate

In rough order of weight:

1. **Judgment** — did you make real decisions, and can you defend them?
2. **User-centricity** — does this reflect a point of view about Maya specifically?
3. **Engineering quality** — types that mean something, sane state, behaviour that holds up
   when we break the API.
4. **Handling of reality** — the messy data, the slow network, the rate limits.
5. **Communication** — the README and the video.

What we're not scoring: number of features, visual polish beyond "a professional would use
this without wincing", test coverage, commit hygiene.

---

## Appendix: LLM provider setup

All three of these have genuine free tiers with no credit card. Pick one; we have no preference.

**Google AI Studio (Gemini)** — https://aistudio.google.com/apikey
Free tier, no card. Roughly 10–15 requests/minute and 250–1,000 requests/day depending on
model, 250k tokens/minute. Generous on tokens, tight on requests/minute.

**Groq** — https://console.groq.com/keys
Free tier, no card, no credits system. 30 requests/minute but only **6,000 tokens/minute** and
14,400 requests/day. Very fast, and the token/minute cap is low enough that you will meet it.

**OpenRouter** — https://openrouter.ai/keys
Has `:free` model variants. Useful as a fallback or for comparison.

**These limits are part of the assignment, not an obstacle to route around.** With around 40 records,
one of which is very long, you will hit a limit. How you handle that is signal.

**Escape hatch:** if you get rate-limited, blocked, or a provider won't sign you up in your
region, commit your cached LLM responses as fixtures and carry on building against those. Note
it in the README. That is not a failure — it's what you'd do at work.

Keep your key in `.env` (it's gitignored) and never commit it. If you accidentally do, tell us;
we've all done it.
