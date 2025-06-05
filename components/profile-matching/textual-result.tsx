"use client";

import React from "react";
import { useProfileMatchingStore } from "@/lib/pm/store";
import { CheckCircle } from "lucide-react";
import { formatNumber } from "@/lib/ahp";

type Props = {};

const TextualResult = (props: Props) => {
  const { calculationResults, alternatives, criteria } =
    useProfileMatchingStore();

  if (!calculationResults) return null;

  return (
    <div className="bg-green-50 p-4 rounded-md flex items-start mb-6">
      <CheckCircle className="h-12 w-12 text-green-500 -mt-3 mr-2" />
      <div>
        <h3 className="font-medium text-green-700">Conclusion</h3>
        <p className="text-green-600 text-sm mt-1">
          The application of the Profile Matching method resulted in a clear
          ranking of the alternatives, with{" "}
          <span className="font-bold">{` ${
            alternatives.find(
              (a) => a.id === calculationResults.finalRanking[0].alternativeId
            )?.name
          } `}</span>{" "}
          securing the highest position. Its cumulative score of{" "}
          <span className="font-bold">{` ${
            calculationResults.finalRanking[0].totalScore.toFixed(2)
          } `}</span>{" "}
          underscores its superiority, making it the most highly recommended
          candidate based on the established ideal profile and criteria. This
          highest rank identifies Candidate <span className="font-bold">{` ${alternatives.find(
            (a) => a.id === calculationResults.finalRanking[0].alternativeId
          )?.name} `}</span> as the best alternative
          according to this Profile Matching analysis.
        </p>
      </div>
    </div>
  );
};

export default TextualResult;
