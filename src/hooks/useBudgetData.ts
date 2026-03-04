import { useState, useEffect } from 'react';
import {
  loadSummary,
  loadReceipts,
  loadExpenditure,
  loadSankey,
  loadTreemap,
  loadStatewise,
  loadSchemes,
  loadBudgetTrends,
  loadBudgetVsActual,
} from '../lib/dataLoader.ts';
import type {
  BudgetSummary,
  BudgetTrendsData,
  BudgetVsActualData,
  ReceiptsData,
  ExpenditureData,
  SankeyData,
  TreemapData,
  StatewiseData,
  SchemesData,
} from '../lib/data/schema.ts';

interface BudgetData {
  summary: BudgetSummary | null;
  receipts: ReceiptsData | null;
  expenditure: ExpenditureData | null;
  sankey: SankeyData | null;
  treemap: TreemapData | null;
  statewise: StatewiseData | null;
  schemes: SchemesData | null;
  trends: BudgetTrendsData | null;
  budgetVsActual: BudgetVsActualData | null;
  loading: boolean;
  error: string | null;
}

export function useBudgetData(year: string): BudgetData {
  const [data, setData] = useState<BudgetData>({
    summary: null,
    receipts: null,
    expenditure: null,
    sankey: null,
    treemap: null,
    statewise: null,
    schemes: null,
    trends: null,
    budgetVsActual: null,
    loading: true,
    error: null,
  });

  // Reset loading state when dependency changes (React-recommended "setState during render" pattern)
  const [prevYear, setPrevYear] = useState(year);
  if (prevYear !== year) {
    setPrevYear(year);
    setData((d) => ({ ...d, loading: true, error: null }));
  }

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      loadSummary(year),
      loadReceipts(year),
      loadExpenditure(year),
      loadSankey(year),
      loadTreemap(year),
      loadStatewise(year),
      loadSchemes(year),
      loadBudgetTrends(year),
      loadBudgetVsActual(year),
    ])
      .then(([summary, receipts, expenditure, sankey, treemap, statewise, schemes, trends, budgetVsActual]) => {
        if (!cancelled) {
          setData({
            summary,
            receipts,
            expenditure,
            sankey,
            treemap,
            statewise,
            schemes,
            trends,
            budgetVsActual,
            loading: false,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setData((d) => ({ ...d, loading: false, error: String(err) }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [year]);

  return data;
}
