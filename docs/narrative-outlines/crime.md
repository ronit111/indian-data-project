# Crime -- Narrative Outline

## Headline Thesis

India's criminal justice system is a pipeline with holes at every stage: too much crime, too few police, and a court system so slow that justice deferred becomes justice denied for 31 lakh families.

## Arc Type

**Systemic-breakdown** -- each beat raises the stakes. The escalation is: volume (how much crime) then targets (who is most affected) then evolution (new threats outpacing old responses) then capacity (who fights this) then accountability (what happens after). Every beat makes the next one worse.

## Opening Hook

58 lakh crimes in 2022. One every 5 seconds. And those are just the ones that were reported. Follow one crime from the moment it happens to the moment the court delivers a verdict -- on average, that journey takes 3.5 years. For 31 lakh cases, the journey hasn't even started.

## Beats (ordered)

### Beat 1: The State of Crime (Overview)
- **Narrative function**: ESTABLISHES the baseline. India's crime volume is large but the more interesting story is composition and trend. IPC crimes (everyday offences: theft, assault, murder) account for ~61% of the total. SLL (Special & Local Laws) cover drugs, cybercrime, and specific statutes. The 2020 dip was lockdown suppression, not safety improvement -- the rebound to pre-COVID levels confirms this. State-level rates vary enormously, but high rates can mean better reporting, not worse safety. This caveat is important: the data is structurally incomplete because most crime goes unreported.
- **Key data**: Line chart -- IPC vs SLL, 2014-2022. COVID dip annotation. Total: 58 lakh. Growth since 2014. DotStrip -- IPC crime composition (theft, hurt, burglary dominate). State choropleth -- crime rate per lakh.
- **Emotional register**: Disquiet / sober attention
- **Transition to next**: Within this ocean of crime, one category demands separate attention. Not because the numbers are the largest -- but because the victims are targeted for who they are.

### Beat 2: Crimes Against Women
- **Narrative function**: ARGUES that women face a specific and worsening pattern of violence. This is not a subset of general crime; it is a structural condition. 4.45 lakh reported cases in 2022 -- one every 71 seconds. The composition is devastating: cruelty by husbands accounts for 1 in 3 cases. Kidnapping and abduction is second. The rate climbed from 56 to 66 per lakh women in 8 years. The ambiguity is real: rising numbers could mean more reporting (a good thing, meaning women trust the system more) or more violence (a terrible thing). Likely both. Either way, the scale is staggering.
- **Key data**: Line chart -- total cases 2014-2022. Bar chart -- crime types (cruelty, kidnapping, assault dominate). Choropleth -- state rates per lakh women (Rajasthan and Delhi lead). Rate: 1,218 cases per day.
- **Emotional register**: Anger / grief
- **Transition to next**: Crime is not only about people harming people. India's roads are deadlier than its criminals.

### Beat 3: Roads That Kill
- **Narrative function**: ARGUES that road deaths are India's silent epidemic. This beat should genuinely shock. 1.68 lakh dead in 2022 -- 461 per day -- more than all violent crime combined. India has 1% of the world's vehicles but 11% of global road deaths. The cause breakdown is damning: over-speeding alone causes 72% of fatal accidents. This is not fate. It is preventable death at industrial scale, driven by identifiable and fixable causes.
- **Key data**: Area chart -- killed and injured 2014-2022. Causes bar chart (over-speeding at 72%). State fatality rates DotStrip (top 15). "1% of vehicles, 11% of deaths" -- this framing should be a hero moment.
- **Emotional register**: Shock / urgency
- **Transition to next**: While roads kill in the physical world, a new frontier of crime is exploding in the digital one -- and the system is even less equipped to handle it.

### Beat 4: The Digital Crime Wave (Cybercrime)
- **Narrative function**: ARGUES that India's digital economy grew faster than its digital policing. Cybercrime FIRs tripled in 5 years. But the real gap is between complaints and action: 22.68 lakh complaints filed on the I4C portal, only ~3% became FIRs. The gap visualization (complaints vs FIRs) should be the most damning visual on this page. Online fraud accounts for ~42% of cases. Financial loss: thousands of crore. The BNS transition (IPC replaced July 2024) adds confusion to an already overwhelmed system.
- **Key data**: Line chart -- NCRB cybercrime FIRs 2017-2022. Gap visualization: 22.68L complaints vs ~65K FIRs. Financial loss figure. Crime types bar chart (fraud dominates).
- **Emotional register**: Alarm / disbelief
- **Transition to next**: Four beats of escalating crime -- general, gendered, vehicular, digital. The natural question: who is supposed to handle all of this?

### Beat 5: Who Polices 140 Crore People?
- **Narrative function**: ARGUES that the police force is structurally undermanned for the task. This is where the systemic breakdown thesis lands hardest in terms of capacity. India has ~155 police per lakh population; the UN recommends 222. But the national number masks extreme variation: Delhi at 492, Bihar at 77. 22% of sanctioned posts are vacant -- positions the government itself says are needed, unfilled. Women are 11.7% of the force, policing a country where crimes against women require sensitive first response. The bullet chart (India vs UN recommendation) should be a gut punch.
- **Key data**: Bullet chart -- actual vs UN recommended per lakh. Small multiples -- state ratios with UN reference line. Vacancy stat: 22%. Women in police: 11.7%. Bihar-Delhi contrast as a pair.
- **Emotional register**: Frustration / systemic despair
- **Transition to next**: Understaffed police feed an understaffed court system. What happens to a case after it's filed?

### Beat 6: The Justice Pipeline
- **Narrative function**: CLOSES the loop. This is the final beat and it should feel like watching water drain from a bucket with holes. The funnel chart is the climax of the page: of every 100 crimes reported, only 13 end in conviction. The narrowing happens at every stage -- investigation backlogs, low chargesheet rates, trials averaging 3.5 years. 31 lakh cases pending. India has 21 judges per million citizens; the global average is ~50. The conviction rate (39%) compared to the UK or Japan (70%+) is not just a number -- it means that for most victims, filing a case leads to years of waiting and, statistically, no outcome. The "13 out of 100" framing is the number the reader should carry with them.
- **Key data**: Funnel chart -- FIR to conviction. Conviction rate bullet (39% vs 50% benchmark). Three stat cards: avg trial 3.5 years, 21 judges per million, 31 lakh pending. "13 out of 100" as the page's defining metric.
- **Emotional register**: Resolution / sober clarity
- **Transition to next**: (Closing)

## Internal Consistency Rules

- **Denominator**: "Per lakh population" for crime rates, police ratios. "Per lakh women" for women's safety rates. Never mix.
- **Time period**: 2014-2022 is the default trend window (matches NCRB data availability). Cybercrime: 2017-2022 (NCRB only started categorizing it separately). All sections use the same year (2022) for cross-section comparisons.
- **Source distinction**: NCRB for crime and police data. MoRTH (Ministry of Road Transport and Highways) for road accidents. BPRD (Bureau of Police Research and Development) for police strength. I4C for cybercrime complaints (separate from NCRB FIRs). Always attribute.
- **IPC/BNS note**: BNS replaced IPC in July 2024. All data uses IPC-era classification. Acknowledge once (Beat 1), don't repeat.
- **Under-reporting caveat**: State explicitly in Beat 1 that NCRB data reflects reported crime only. Do not overstate certainty about true crime levels. Repeat this caveat in Beat 2 (women) and Beat 4 (cyber).

## Closing

The closing should not be hopeless. It should be clear-eyed:

"58 lakh crimes. 4.45 lakh against women. 1.68 lakh dead on roads. 22 lakh cybercrime complaints. 155 police per lakh people. 39% conviction rate. 31 lakh cases waiting. These numbers are not an indictment of Indian society -- they are a measure of the gap between the problem and the response. The data makes the gap visible. Visibility is the first step toward closing it."

Then: links to Democratic Accountability topic (policing is a governance question), Social Safety Net topic (victims need support systems), and the Crime explorer.

## Cross-Domain Connections

| Beat | Links to | Why |
|------|----------|-----|
| Beat 1 (Overview) | States | Crime rates vary 5x across states. Uttar Pradesh and Bihar are both volume leaders and policing laggards. Same "different country" thesis. |
| Beat 2 (Women) | Education, Healthcare | Women's safety correlates with education levels and health infrastructure. States with lower female literacy have higher domestic violence rates. |
| Beat 3 (Roads) | Economy, Environment | Road deaths track motorization, which tracks GDP growth. More vehicles (economic success) means more deaths (infrastructure failure). Environment domain covers vehicular emissions -- same vehicles. |
| Beat 4 (Cybercrime) | Economy | Digital economy growth (UPI, e-commerce) created the attack surface. Cybercrime is the shadow of Digital India. |
| Beat 5 (Police) | Budget, States | Police budgets come from state finances (policing is a state subject). Bihar's low police ratio is a direct consequence of its fiscal constraints (States Beat 3). |
| Beat 6 (Justice) | Elections | MPs with criminal cases (Elections Beat 4) navigate the same slow justice system. The very people who could reform it benefit from its dysfunction. |
