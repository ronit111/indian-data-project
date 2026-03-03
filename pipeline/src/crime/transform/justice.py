"""
Transform justice pipeline data.

Outputs:
  - justice.json: The funnel from FIR → investigation → chargesheet → trial → conviction,
    plus pendency and trial duration stats
"""


def build_justice(
    pipeline: dict,
    trial_duration: dict,
    survey_year: str,
) -> dict:
    """Build the justice pipeline JSON output."""

    # Build the Sankey-style funnel nodes and links
    funnel = {
        "totalForInvestigation": pipeline["totalCasesForInvestigation"],
        "investigated": pipeline["casesInvestigated"],
        "chargesheeted": pipeline["chargesheetFiled"],
        "chargesheetRate": pipeline["chargesheetRate"],
        "totalForTrial": pipeline["totalCasesForTrial"],
        "trialCompleted": pipeline["casesTrialCompleted"],
        "convicted": pipeline["convicted"],
        "acquitted": pipeline["acquitted"],
        "convictionRate": pipeline["convictionRate"],
        "pendingInvestigation": pipeline["pendingInvestigation"],
        "pendingTrial": pipeline["pendingTrial"],
        "pendencyRate": pipeline["pendencyRate"],
    }

    duration = {
        "avgYears": trial_duration["avgYears"],
        "casesOver5Years": trial_duration["casesOver5Years"],
        "casesOver10Years": trial_duration["casesOver10Years"],
        "judgesPerMillion": trial_duration["judgesPerMillionPopulation"],
    }

    return {
        "year": survey_year,
        "funnel": funnel,
        "trialDuration": duration,
        "source": pipeline["source"],
    }
