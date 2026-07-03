# Healthcare -- Narrative Outline

## Headline Thesis
India spends less on each citizen's health per day than the price of a cup of chai -- and the gap between what the system delivers and what 1.4 billion people need is measured in lives.

## Arc Type
Systemic-breakdown (chronic underinvestment creates cascading failures, with pockets of hope proving the system CAN work)

## Opening Hook
"7 doctors per 10,000 people. That's what stands between 1.4 billion Indians and illness. The WHO recommends 10. India is 30% short -- and that's the national average. In Bihar, it's closer to 1."

The hook personalizes an institutional failure. Not "the health system is underfunded" (abstract) but "there aren't enough doctors for you" (visceral). The Bihar comparison makes the abstraction concrete.

## Beats (ordered)

### Beat 1: The Infrastructure Deficit
- **Beat name**: Half the beds the world says you need
- **Narrative function**: ARGUES that India's healthcare infrastructure is structurally inadequate -- not by Indian standards, but by any standard. 1.6 hospital beds per 1,000 people against a WHO recommendation of 3.5. Less than halfway there. The trend line shows marginal improvement, but the gap remains enormous. The state-level bar chart reveals the internal inequality: Kerala, Karnataka at the top; Bihar, Jharkhand, UP at the bottom.
- **Key data**: Hospital beds, physicians, and nurses per 1,000 (time series lines). State-level beds per lakh bar chart (top 15 states). The 3.5 WHO benchmark is the implicit reference.
- **Emotional register**: Shock (the numbers are worse than most people assume)
- **Transition to next**: "Why is the infrastructure so thin? Follow the money."

### Beat 2: The Spending Story
- **Beat name**: 3.3% of GDP
- **Narrative function**: ARGUES that chronic underinvestment is the root cause of every other healthcare failure. India spends 3.3% of GDP on health -- roughly half the global average of ~6.5%. Even Sri Lanka and Thailand, with smaller economies, spend a higher share. The per-capita INR conversion is the emotional gut punch: the system spends approximately 19 rupees per citizen per day. Less than a cup of chai.
- **Key data**: Health expenditure as % GDP (total and government lines), per-capita health spending in INR (with the animated "19 per day" hero counter). The 19/day number is the hero moment of the entire domain.
- **Emotional register**: Anger (this is a choice, not an inevitability)
- **Transition to next**: "When the government doesn't pay, someone has to. That someone is you."

### Beat 3: The Out-of-Pocket Burden
- **Beat name**: 44 paise of every health rupee comes from your pocket
- **Narrative function**: ARGUES that India's out-of-pocket health expenditure (OOPE) rate -- about 44% -- is among the highest in the world. This means families directly bear nearly half of all healthcare costs. The trend has improved (down from over 70% in 2000), but remains far above the global average. The human cost: 5.5 crore Indians are pushed into poverty every year by medical bills. Ayushman Bharat covers hospitalization for 55 crore citizens, but outpatient costs -- the everyday doctor visits, the medicines -- remain largely uncovered.
- **Key data**: Out-of-pocket % of total health spending (time series). The downward trend shows progress, but the absolute level remains high.
- **Emotional register**: Personal dread (this could happen to anyone -- one medical emergency away from poverty)
- **Transition to next**: "But the story isn't all deficit. India has made remarkable progress where it focused its attention."

### Beat 4: The Immunization Triumph
- **Beat name**: What happens when the system tries
- **Narrative function**: ARGUES that India CAN deliver public health outcomes at scale when it commits resources and political will. DPT and measles vaccination coverage now exceed 90% nationally. This is a direct, measurable, life-saving achievement. The state-level bar chart shows that even lagging states have crossed 60-70%. This beat exists to prove that the infrastructure deficit (Beat 1) and spending gap (Beat 2) are choices, not destiny -- because when India decides to act, the results are extraordinary.
- **Key data**: DPT and measles coverage over time (two lines climbing past 90%), state-level full immunization bar chart (top 15 states).
- **Emotional register**: Hope (a genuine bright spot -- the system works when it focuses)
- **Transition to next**: "Immunization protects children. But older Indians face a different threat."

### Beat 5: The Disease Burden
- **Beat name**: Old enemies, new threats
- **Narrative function**: ARGUES that India faces a double disease burden. The old enemy: tuberculosis. India has the world's highest TB burden -- over 26 lakh cases per year. TB is falling but stubbornly persistent. The new threat: non-communicable diseases (diabetes, heart disease, cancer) rising as the population ages and urbanizes. India is fighting yesterday's war (infectious disease) while tomorrow's war (lifestyle disease) advances on the flank.
- **Key data**: TB incidence trend (falling but still enormous), HIV prevalence (low and stable -- a relative success). The annotation about NCDs adds context beyond the chart data.
- **Emotional register**: Tension (progress on one front, new danger on another)
- **Transition to next**: "The national averages hide the sharpest inequality of all."

### Beat 6: The Doctor Gap
- **Beat name**: Kerala has 8x more doctors than Bihar
- **Narrative function**: ARGUES that state-level variation in healthcare is so extreme that India effectively contains First World and developing-world health systems within the same borders. The choropleth of doctors per 10,000 by state is the closing argument: the gradient from rose (well-served) to gray (critically short) maps almost perfectly onto the IMR choropleth from Census. The states with the fewest doctors have the most deaths. Geography is destiny in Indian healthcare.
- **Key data**: State choropleth of doctors per 10,000 population. WHO recommended minimum (10) as national average reference.
- **Emotional register**: Resolution with weight (the inequality is the summary of everything -- the why behind every other beat)
- **Transition to next**: (Closing section -- no transition needed)

## Internal Consistency Rules
- **Denominator**: Infrastructure always "per 1,000 people" (beds, physicians, nurses). Disease incidence is "per lakh" (TB) or "%" (HIV). Out-of-pocket is "% of total health spending." Never mix.
- **Time period**: 2000-2022 for World Bank time series. State-level data: NHP (National Health Profile) latest for infrastructure, NFHS-5 for immunization. Always label which source for state data.
- **Spending figure**: "3.3% of GDP" for total health expenditure, not just government. Government health expenditure is a separate, lower number (~1.3% of GDP). Don't conflate them.
- **Per-capita framing**: Use the INR figure (approximately 19 rupees per day) as the tangible anchor. The USD per-capita number from World Bank is converted using RBI exchange rates. Define the conversion once.
- **Out-of-pocket**: "44 paise of every health rupee" (or "44%"). Use the "paise per rupee" framing throughout, matching the Budget domain's approach. Don't switch between "44%" and "44 paise" arbitrarily.
- **Doctor comparison**: "Kerala has nearly 8x more doctors per capita than Bihar" -- use "per capita" not "per 10K" in prose (the chart uses per 10K).

## Closing
The reader walks away with a contradiction they can't resolve comfortably: India's healthcare system performs miracles -- immunization coverage at 90%, infant mortality halved in two decades, TB slowly yielding to treatment. But "performing miracles with almost nothing" is not a strategy. It's a survival mode. The 19 rupees per day is the number that should haunt the reader. Not because it's the lowest in the world (it isn't), but because it's the clearest measure of the gap between what India needs and what India gets. The immunization beat proves the system CAN deliver. The spending beat proves it CHOOSES not to.

## Cross-Domain Connections
- **Beat 1 (Infrastructure)** links to **Census** (the state-level bed distribution maps onto the IMR choropleth -- same states, same deficit)
- **Beat 2 (Spending)** links to **Budget** (health spending as a share of Union Budget expenditure) and **Education / Spending** (the twin underfunded social sectors)
- **Beat 3 (Out-of-Pocket)** links to **Employment / Informality** (no ESI for informal workers means no health cover -- 80% of workers are uncovered)
- **Beat 4 (Immunization)** links to **Census / Health** (immunization is the upstream investment that drives down IMR)
- **Beat 6 (Doctor Gap)** links to **States** (the doctor distribution maps onto the broader state inequality narrative)
