"use client";

import { useState } from "react";
import { getYearlyReportData } from "@/app/actions/report";
import { generatePDF } from "@/app/utils/pdf-client";
import { Button } from "@/app/components/ui/button";

interface YearlyReportButtonProps {
    storeId: string;
    year?: number;
}

export default function YearlyReportButton({ 
    storeId, 
    year = new Date().getFullYear() 
}: {storeId: string; year?: number;}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePDF = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await getYearlyReportData(storeId, year);
            if (!result.success || !result.data) {
                throw new Error(result.error || "Failed to fetch report data");
            }
            const doc = generatePDF(result.data);
            doc.save(`${result.data.storeName}-${year}-report.pdf`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button
                onClick={handleGeneratePDF}
                disabled={loading}
                className="rounded-r1"
            >
                {loading ? "Generating PDF..." : `Generate ${year} Report PDF`}
            </Button>
            {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        </div>
    );
}