import type { Criterion, Alternative, PairwiseMatrix, AlternativeMatrix } from "@/context/ahp-context"

// Helper function to convert column index to Excel column letter
function getExcelColumn(index: number): string {
  let column = ""
  while (index >= 0) {
    column = String.fromCharCode((index % 26) + 65) + column
    index = Math.floor(index / 26) - 1
  }
  return column
}

// Create a styled cell
function createStyledCell(value: any, style: any = {}): any {
  return {
    v: value, // value
    t: typeof value === "number" ? "n" : "s", // type (n: number, s: string)
    s: style, // style
  }
}

// Helper function to round numbers to 3 decimal places
function roundToThreeDecimals(value: number): number {
  return Math.round(value * 1000) / 1000
}

// ===== STYLE DEFINITIONS =====

// Pastel Blue Theme
const blueTheme = {
  headerStyle: {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "8CB9D3" } }, // Pastel blue
    alignment: { horizontal: "center", vertical: "center" },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  subheaderStyle: {
    font: { bold: true },
    fill: { fgColor: { rgb: "D6EAF8" } }, // Light pastel blue
    alignment: { horizontal: "center" },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  formulaStyle: {
    font: { italic: true },
    fill: { fgColor: { rgb: "EBF5FB" } }, // Very light pastel blue
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  resultStyle: {
    font: { bold: true },
    fill: { fgColor: { rgb: "AED6F1" } }, // Medium pastel blue
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  sumStyle: {
    font: { bold: true },
    fill: { fgColor: { rgb: "5DADE2" } }, // Darker pastel blue
    border: { top: { style: "thin" }, bottom: { style: "double" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  titleStyle: {
    font: { bold: true, sz: 16, color: { rgb: "2E86C1" } },
    alignment: { horizontal: "center" },
  },
}

// Pastel Green Theme
const greenTheme = {
  headerStyle: {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "A3E4D7" } }, // Pastel green
    alignment: { horizontal: "center", vertical: "center" },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  subheaderStyle: {
    font: { bold: true },
    fill: { fgColor: { rgb: "D5F5E3" } }, // Light pastel green
    alignment: { horizontal: "center" },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  formulaStyle: {
    font: { italic: true },
    fill: { fgColor: { rgb: "EAFAF1" } }, // Very light pastel green
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  resultStyle: {
    font: { bold: true },
    fill: { fgColor: { rgb: "ABEBC6" } }, // Medium pastel green
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  sumStyle: {
    font: { bold: true },
    fill: { fgColor: { rgb: "58D68D" } }, // Darker pastel green
    border: { top: { style: "thin" }, bottom: { style: "double" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  titleStyle: {
    font: { bold: true, sz: 16, color: { rgb: "27AE60" } },
    alignment: { horizontal: "center" },
  },
  explanationStyle: {
    font: { italic: true, color: { rgb: "27AE60" } },
    alignment: { horizontal: "left" },
  },
}

// Pastel Purple Theme
const purpleTheme = {
  headerStyle: {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "D2B4DE" } }, // Pastel purple
    alignment: { horizontal: "center", vertical: "center" },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  subheaderStyle: {
    font: { bold: true },
    fill: { fgColor: { rgb: "E8DAEF" } }, // Light pastel purple
    alignment: { horizontal: "center" },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  formulaStyle: {
    font: { italic: true },
    fill: { fgColor: { rgb: "F4ECF7" } }, // Very light pastel purple
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  resultStyle: {
    font: { bold: true },
    fill: { fgColor: { rgb: "D7BDE2" } }, // Medium pastel purple
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  sumStyle: {
    font: { bold: true },
    fill: { fgColor: { rgb: "AF7AC5" } }, // Darker pastel purple
    border: { top: { style: "thin" }, bottom: { style: "double" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  titleStyle: {
    font: { bold: true, sz: 16, color: { rgb: "8E44AD" } },
    alignment: { horizontal: "center" },
  },
}

// Pastel Orange Theme
const orangeTheme = {
  headerStyle: {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "F5CBA7" } }, // Pastel orange
    alignment: { horizontal: "center", vertical: "center" },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  subheaderStyle: {
    font: { bold: true },
    fill: { fgColor: { rgb: "FAE5D3" } }, // Light pastel orange
    alignment: { horizontal: "center" },
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  formulaStyle: {
    font: { italic: true },
    fill: { fgColor: { rgb: "FEF5E7" } }, // Very light pastel orange
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  resultStyle: {
    font: { bold: true },
    fill: { fgColor: { rgb: "F8C471" } }, // Medium pastel orange
    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  sumStyle: {
    font: { bold: true },
    fill: { fgColor: { rgb: "F39C12" } }, // Darker pastel orange
    border: { top: { style: "thin" }, bottom: { style: "double" }, left: { style: "thin" }, right: { style: "thin" } },
  },
  titleStyle: {
    font: { bold: true, sz: 16, color: { rgb: "D35400" } },
    alignment: { horizontal: "center" },
  },
}

// ===== MAIN EXPORT FUNCTION =====

export async function generateExcel(
  XLSX: any,
  criteria: Criterion[],
  alternatives: Alternative[],
  criteriaPairwise: PairwiseMatrix,
  alternativesPairwise: AlternativeMatrix[],
  finalRanking: { alternativeId: string; score: number }[],
): Promise<void> {
  // Generate all 4 Excel files with different layouts
  await Promise.all([
    generateAndDownloadExcel(
      XLSX,
      criteria,
      alternatives,
      criteriaPairwise,
      alternativesPairwise,
      finalRanking,
      "AHP_Analysis_Blue.xlsx",
      blueTheme,
      "compact",
    ),
    generateAndDownloadExcel(
      XLSX,
      criteria,
      alternatives,
      criteriaPairwise,
      alternativesPairwise,
      finalRanking,
      "AHP_Analysis_Green.xlsx",
      greenTheme,
      "detailed",
    ),
    generateAndDownloadExcel(
      XLSX,
      criteria,
      alternatives,
      criteriaPairwise,
      alternativesPairwise,
      finalRanking,
      "AHP_Analysis_Purple.xlsx",
      purpleTheme,
      "visual",
    ),
    generateAndDownloadExcel(
      XLSX,
      criteria,
      alternatives,
      criteriaPairwise,
      alternativesPairwise,
      finalRanking,
      "AHP_Analysis_Orange.xlsx",
      orangeTheme,
      "presentation",
    ),
  ])
}

// ===== HELPER FUNCTION TO GENERATE AND DOWNLOAD EACH EXCEL FILE =====

async function generateAndDownloadExcel(
  XLSX: any,
  criteria: Criterion[],
  alternatives: Alternative[],
  criteriaPairwise: PairwiseMatrix,
  alternativesPairwise: AlternativeMatrix[],
  finalRanking: { alternativeId: string; score: number }[],
  filename: string,
  theme: any,
  layout: string,
): Promise<void> {
  // Create a new workbook
  const workbook = XLSX.utils.book_new()

  // Create a worksheet based on the layout type
  let ws: any

  switch (layout) {
    case "compact":
      ws = createCompactLayout(
        XLSX,
        criteria,
        alternatives,
        criteriaPairwise,
        alternativesPairwise,
        finalRanking,
        theme,
      )
      break
    case "detailed":
      ws = createDetailedLayout(
        XLSX,
        criteria,
        alternatives,
        criteriaPairwise,
        alternativesPairwise,
        finalRanking,
        theme,
      )
      break
    case "visual":
      ws = createVisualLayout(XLSX, criteria, alternatives, criteriaPairwise, alternativesPairwise, finalRanking, theme)
      break
    case "presentation":
      ws = createPresentationLayout(
        XLSX,
        criteria,
        alternatives,
        criteriaPairwise,
        alternativesPairwise,
        finalRanking,
        theme,
      )
      break
    default:
      ws = createCompactLayout(
        XLSX,
        criteria,
        alternatives,
        criteriaPairwise,
        alternativesPairwise,
        finalRanking,
        theme,
      )
  }

  // Set print options for the worksheet
  ws["!printHeader"] = ["A1:Z1"] // Repeat first row as header
  ws["!margins"] = {
    left: 0.5,
    right: 0.5,
    top: 0.75,
    bottom: 0.75,
    header: 0.3,
    footer: 0.3,
  }

  // Set page orientation to landscape
  ws["!pageSetup"] = {
    orientation: "landscape",
    fitToWidth: 1,
    fitToHeight: 0, // 0 means "auto"
  }

  XLSX.utils.book_append_sheet(workbook, ws, "AHP Analysis")

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

  // Create a Blob from the buffer
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

  // Create download link
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename

  // Trigger download
  document.body.appendChild(link)
  link.click()

  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ===== LAYOUT 1: COMPACT LAYOUT (BLUE THEME) =====

function createCompactLayout(
  XLSX: any,
  criteria: Criterion[],
  alternatives: Alternative[],
  criteriaPairwise: PairwiseMatrix,
  alternativesPairwise: AlternativeMatrix[],
  finalRanking: { alternativeId: string; score: number }[],
  theme: any,
): any {
  const ws: any = {}
  const data: any[][] = []
  let currentRow = 0

  // Title
  data.push([createStyledCell("AHP ANALYSIS - COMPACT FORMAT", theme.titleStyle)])
  currentRow++

  // Add date
  const today = new Date()
  data.push([
    createStyledCell(`Generated on: ${today.toLocaleDateString()}`, {
      font: { italic: true },
      alignment: { horizontal: "center" },
    }),
  ])
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // ===== CRITERIA AND ALTERNATIVES OVERVIEW =====

  // Criteria section
  data.push([createStyledCell("CRITERIA", theme.headerStyle)])
  currentRow++

  const criteriaHeaderRow = [
    createStyledCell("ID", theme.subheaderStyle),
    createStyledCell("Name", theme.subheaderStyle),
  ]
  data.push(criteriaHeaderRow)
  currentRow++

  criteria.forEach((criterion) => {
    data.push([createStyledCell(criterion.id), createStyledCell(criterion.name)])
    currentRow++
  })

  // Alternatives section
  data.push([]) // Empty row
  currentRow++
  data.push([createStyledCell("ALTERNATIVES", theme.headerStyle)])
  currentRow++

  const altHeaderRow = [createStyledCell("ID", theme.subheaderStyle), createStyledCell("Name", theme.subheaderStyle)]
  data.push(altHeaderRow)
  currentRow++

  alternatives.forEach((alternative) => {
    data.push([createStyledCell(alternative.id), createStyledCell(alternative.name)])
    currentRow++
  })

  data.push([]) // Empty row
  currentRow++

  // ===== CRITERIA PAIRWISE COMPARISON =====

  data.push([createStyledCell("CRITERIA PAIRWISE COMPARISON", theme.headerStyle)])
  currentRow++

  // Header row with criteria names
  const criteriaCompHeaderRow = [createStyledCell("Criterion", theme.subheaderStyle)]
  criteria.forEach((criterion) => {
    criteriaCompHeaderRow.push(createStyledCell(criterion.name, theme.subheaderStyle))
  })
  criteriaCompHeaderRow.push(createStyledCell("Priority", theme.subheaderStyle))
  data.push(criteriaCompHeaderRow)
  currentRow++

  // Matrix rows with priorities
  const criteriaPairwiseStartRow = currentRow
  criteria.forEach((rowCriterion, rowIndex) => {
    const row = [createStyledCell(rowCriterion.name)]
    criteria.forEach((colCriterion, colIndex) => {
      if (rowIndex === colIndex) {
        row.push(createStyledCell(1))
      } else {
        row.push(createStyledCell(criteriaPairwise.matrix[rowIndex][colIndex]))
      }
    })
    // Add priority directly
    row.push(createStyledCell(criteriaPairwise.priorityVector[rowIndex], theme.resultStyle))
    data.push(row)
    currentRow++
  })

  // Add sum row
  const sumRow = [createStyledCell("SUM", theme.sumStyle)]
  for (let j = 0; j < criteria.length; j++) {
    const colLetter = getExcelColumn(j + 1)
    const formula = `SUM(${colLetter}${criteriaPairwiseStartRow + 1}:${colLetter}${criteriaPairwiseStartRow + criteria.length})`
    sumRow.push({
      f: formula,
      t: "n",
      s: theme.sumStyle,
    })
  }
  // Add sum of priorities (should be 1)
  const priorityCol = getExcelColumn(criteria.length + 1)
  const prioritySumFormula = `SUM(${priorityCol}${criteriaPairwiseStartRow + 1}:${priorityCol}${criteriaPairwiseStartRow + criteria.length})`
  sumRow.push({
    f: prioritySumFormula,
    t: "n",
    s: theme.sumStyle,
  })
  data.push(sumRow)
  currentRow++

  // Consistency info
  data.push([]) // Empty row
  currentRow++
  data.push([
    createStyledCell("Consistency Ratio (CR):", {
      font: { bold: true },
      alignment: { horizontal: "right" },
    }),
    createStyledCell(criteriaPairwise.consistencyRatio, theme.resultStyle),
    createStyledCell(criteriaPairwise.consistencyRatio <= 0.1 ? "Consistent" : "Inconsistent", {
      font: { bold: true },
      fill: {
        fgColor: { rgb: criteriaPairwise.consistencyRatio <= 0.1 ? "A9DFBF" : "F5B7B1" },
      },
    }),
  ])
  currentRow++

  data.push([]) // Empty row
  currentRow++

  // ===== ALTERNATIVE PAIRWISE COMPARISONS - COMPACT SUMMARY =====

  data.push([createStyledCell("ALTERNATIVE PRIORITIES BY CRITERION", theme.headerStyle)])
  currentRow++

  // Header row
  const altPriorityHeaderRow = [createStyledCell("Alternative", theme.subheaderStyle)]
  criteria.forEach((criterion) => {
    altPriorityHeaderRow.push(createStyledCell(criterion.name, theme.subheaderStyle))
  })
  altPriorityHeaderRow.push(createStyledCell("Overall Score", theme.subheaderStyle))
  data.push(altPriorityHeaderRow)
  currentRow++

  // Alternative scores
  const altScoresStartRow = currentRow
  alternatives.forEach((alternative, altIndex) => {
    const row = [createStyledCell(alternative.name)]

    // Add scores for each criterion
    criteria.forEach((criterion, critIndex) => {
      const matrix = alternativesPairwise.find((m) => m.criterionId === criterion.id)
      if (matrix) {
        row.push(createStyledCell(matrix.priorityVector[altIndex], theme.formulaStyle))
      } else {
        row.push(createStyledCell(0))
      }
    })

    // Add overall score formula
    let formula = ""
    for (let i = 0; i < criteria.length; i++) {
      const criterionWeight = criteriaPairwise.priorityVector[i]
      const altScore = getExcelColumn(i + 1) + (altScoresStartRow + altIndex + 1)

      if (i > 0) formula += "+"
      formula += `${altScore}*${criterionWeight}`
    }

    row.push({
      f: formula,
      t: "n",
      s: theme.resultStyle,
    })

    data.push(row)
    currentRow++
  })

  // ===== FINAL RANKING =====

  data.push([]) // Empty row
  currentRow++
  data.push([createStyledCell("FINAL RANKING", theme.headerStyle)])
  currentRow++

  data.push([
    createStyledCell("Rank", theme.subheaderStyle),
    createStyledCell("Alternative", theme.subheaderStyle),
    createStyledCell("Score", theme.subheaderStyle),
  ])
  currentRow++

  // Create a reference to the overall scores
  const scoreCol = getExcelColumn(criteria.length + 1)

  // Add ranking with RANK formula
  alternatives.forEach((alternative, index) => {
    const row = [
      {
        f: `RANK(${scoreCol}${altScoresStartRow + index + 1},${scoreCol}${altScoresStartRow + 1}:${scoreCol}${altScoresStartRow + alternatives.length})`,
        t: "n",
        s: theme.resultStyle,
      },
      createStyledCell(alternative.name),
      {
        f: `${scoreCol}${altScoresStartRow + index + 1}`,
        t: "n",
        s: theme.resultStyle,
      },
    ]
    data.push(row)
    currentRow++
  })

  // Convert data to worksheet
  const maxCols = Math.max(...data.map((row) => row.length))
  const range = { s: { c: 0, r: 0 }, e: { c: maxCols - 1, r: data.length - 1 } }
  ws["!ref"] = XLSX.utils.encode_range(range)

  // Add data to worksheet
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j]) {
        const cell_address = { c: j, r: i }
        const cell_ref = XLSX.utils.encode_cell(cell_address)
        ws[cell_ref] = data[i][j]
      }
    }
  }

  // Set column widths
  const colWidths = [{ wch: 20 }] // First column wider for labels
  for (let i = 0; i < Math.max(criteria.length, alternatives.length) + 2; i++) {
    colWidths.push({ wch: 15 })
  }
  ws["!cols"] = colWidths

  return ws
}

// ===== LAYOUT 2: DETAILED LAYOUT (GREEN THEME) =====

function createDetailedLayout(
  XLSX: any,
  criteria: Criterion[],
  alternatives: Alternative[],
  criteriaPairwise: PairwiseMatrix,
  alternativesPairwise: AlternativeMatrix[],
  finalRanking: { alternativeId: string; score: number }[],
  theme: any,
): any {
  const ws: any = {}
  const data: any[][] = []
  let currentRow = 0

  // Title
  data.push([createStyledCell("AHP ANALYSIS - DETAILED FORMAT", theme.titleStyle)])
  currentRow++

  // Add date
  const today = new Date()
  data.push([
    createStyledCell(`Generated on: ${today.toLocaleDateString()}`, {
      font: { italic: true },
      alignment: { horizontal: "center" },
    }),
  ])
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // ===== CRITERIA AND ALTERNATIVES OVERVIEW =====

  // Criteria section
  data.push([
    createStyledCell("1. CRITERIA AND ALTERNATIVES", {
      font: { bold: true, sz: 14, color: { rgb: theme.headerStyle.fill.fgColor.rgb } },
    }),
  ])
  currentRow++
  data.push([])
  currentRow++

  data.push([createStyledCell("Criteria", theme.headerStyle)])
  currentRow++
  data.push([createStyledCell("ID", theme.subheaderStyle), createStyledCell("Name", theme.subheaderStyle)])
  currentRow++

  criteria.forEach((criterion) => {
    data.push([createStyledCell(criterion.id), createStyledCell(criterion.name)])
    currentRow++
  })
  data.push([]) // Empty row
  currentRow++

  // Alternatives section
  data.push([createStyledCell("Alternatives", theme.headerStyle)])
  currentRow++
  data.push([createStyledCell("ID", theme.subheaderStyle), createStyledCell("Name", theme.subheaderStyle)])
  currentRow++

  alternatives.forEach((alternative) => {
    data.push([createStyledCell(alternative.id), createStyledCell(alternative.name)])
    currentRow++
  })
  data.push([]) // Empty row
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // ===== CRITERIA PAIRWISE COMPARISON =====

  data.push([
    createStyledCell("2. CRITERIA PAIRWISE COMPARISON", {
      font: { bold: true, sz: 14, color: { rgb: theme.headerStyle.fill.fgColor.rgb } },
    }),
  ])
  currentRow++
  data.push([])
  currentRow++

  // Pairwise comparison matrix
  data.push([createStyledCell("Pairwise Comparison Matrix", theme.headerStyle)])
  currentRow++

  // Header row with criteria names
  const criteriaHeaderRow = [createStyledCell("Criterion", theme.subheaderStyle)]
  criteria.forEach((criterion) => {
    criteriaHeaderRow.push(createStyledCell(criterion.name, theme.subheaderStyle))
  })
  data.push(criteriaHeaderRow)
  currentRow++

  // Matrix rows
  const criteriaPairwiseStartRow = currentRow
  criteria.forEach((rowCriterion, rowIndex) => {
    const row = [createStyledCell(rowCriterion.name)]
    criteria.forEach((colCriterion, colIndex) => {
      if (rowIndex === colIndex) {
        row.push(createStyledCell(1))
      } else {
        // Round the matrix value to 3 decimal places
        row.push(createStyledCell(roundToThreeDecimals(criteriaPairwise.matrix[rowIndex][colIndex])))
      }
    })
    data.push(row)
    currentRow++
  })

  // Add sum row
  const sumRow = [createStyledCell("SUM", theme.sumStyle)]
  for (let j = 0; j < criteria.length; j++) {
    const colLetter = getExcelColumn(j + 1)
    const formula = `ROUND(SUM(${colLetter}${criteriaPairwiseStartRow + 1}:${colLetter}${criteriaPairwiseStartRow + criteria.length}),3)`
    sumRow.push({
      f: formula,
      t: "n",
      s: theme.sumStyle,
    })
  }
  data.push(sumRow)
  currentRow++

  data.push([]) // Empty row
  currentRow++

  // Normalized matrix
  data.push([createStyledCell("Normalized Matrix", theme.headerStyle)])
  currentRow++

  // Header row for normalized matrix
  const normHeaderRow = [createStyledCell("Criterion", theme.subheaderStyle)]
  criteria.forEach((criterion) => {
    normHeaderRow.push(createStyledCell(criterion.name, theme.subheaderStyle))
  })
  normHeaderRow.push(createStyledCell("Priority", theme.subheaderStyle))
  data.push(normHeaderRow)
  currentRow++

  // Add normalized matrix rows with formulas
  const normalizedStartRow = currentRow
  criteria.forEach((rowCriterion, rowIndex) => {
    const row = [createStyledCell(rowCriterion.name)]

    // Add normalized values with formulas
    criteria.forEach((colCriterion, colIndex) => {
      const cellRef = getExcelColumn(colIndex + 1) + (criteriaPairwiseStartRow + rowIndex + 1)
      const sumRef = getExcelColumn(colIndex + 1) + (criteriaPairwiseStartRow + criteria.length + 1)

      // Create a formula cell that divides the original value by the column sum and rounds to 3 decimal places
      const formula = `ROUND(${cellRef}/${sumRef},3)`
      row.push({
        f: formula,
        t: "n",
        s: theme.formulaStyle,
      })
    })

    // Add priority vector (row average) formula with rounding
    const rowStart = getExcelColumn(1) + (normalizedStartRow + rowIndex + 1)
    const rowEnd = getExcelColumn(criteria.length) + (normalizedStartRow + rowIndex + 1)
    const formula = `ROUND(AVERAGE(${rowStart}:${rowEnd}),3)`
    row.push({
      f: formula,
      t: "n",
      s: theme.resultStyle,
    })

    data.push(row)
    currentRow++
  })

  // Add sum row for verification
  const normSumRow = [createStyledCell("SUM", theme.sumStyle)]
  for (let j = 0; j < criteria.length; j++) {
    const colLetter = getExcelColumn(j + 1)
    const formula = `ROUND(SUM(${colLetter}${normalizedStartRow + 1}:${colLetter}${normalizedStartRow + criteria.length}),3)`
    normSumRow.push({
      f: formula,
      t: "n",
      s: theme.sumStyle,
    })
  }

  // Add sum of priorities (should be 1)
  const priorityCol = getExcelColumn(criteria.length + 1)
  const prioritySumFormula = `ROUND(SUM(${priorityCol}${normalizedStartRow + 1}:${priorityCol}${normalizedStartRow + criteria.length}),3)`
  normSumRow.push({
    f: prioritySumFormula,
    t: "n",
    s: theme.sumStyle,
  })

  data.push(normSumRow)
  currentRow++

  data.push([]) // Empty row
  currentRow++

  // ===== WEIGHTED SUM VECTOR CALCULATION =====
  data.push([createStyledCell("Weighted Sum Vector Calculation", theme.headerStyle)])
  currentRow++

  // Add explanation
  data.push([
    createStyledCell(
      "The weighted sum vector is calculated by multiplying the pairwise comparison matrix by the priority vector.",
      theme.explanationStyle,
    ),
  ])
  currentRow++

  // Header row for weighted sum calculation
  const wsHeaderRow = [createStyledCell("Criterion", theme.subheaderStyle)]
  wsHeaderRow.push(createStyledCell("Priority (w)", theme.subheaderStyle))
  wsHeaderRow.push(createStyledCell("Weighted Sum (Aw)", theme.subheaderStyle))
  wsHeaderRow.push(createStyledCell("Ratio (Aw/w)", theme.subheaderStyle))
  data.push(wsHeaderRow)
  currentRow++

  // Store the starting row for weighted sum calculations
  const weightedSumStartRow = currentRow

  // Add weighted sum calculations for each criterion
  criteria.forEach((criterion, rowIndex) => {
    const row = [createStyledCell(criterion.name)]

    // Priority vector value
    const priorityRef = getExcelColumn(criteria.length + 1) + (normalizedStartRow + rowIndex + 1)
    row.push({
      f: priorityRef,
      t: "n",
      s: theme.formulaStyle,
    })

    // Weighted Sum calculation (Aw)
    // Formula: Sum of (each matrix value * corresponding priority)
    let wsFormula = ""
    for (let j = 0; j < criteria.length; j++) {
      const matrixCellRef = getExcelColumn(j + 1) + (criteriaPairwiseStartRow + rowIndex + 1)
      const priorityCellRef = getExcelColumn(criteria.length + 1) + (normalizedStartRow + j + 1)

      if (j > 0) wsFormula += "+"
      wsFormula += `${matrixCellRef}*${priorityCellRef}`
    }

    row.push({
      f: `ROUND(${wsFormula},3)`,
      t: "n",
      s: theme.formulaStyle,
    })

    // Ratio (Aw/w) - This is used to calculate Lambda Max
    row.push({
      f: `ROUND(${getExcelColumn(2)}${weightedSumStartRow + rowIndex + 1}/${getExcelColumn(1)}${weightedSumStartRow + rowIndex + 1},3)`,
      t: "n",
      s: theme.resultStyle,
    })

    data.push(row)
    currentRow++
  })

  data.push([]) // Empty row
  currentRow++

  // ===== CONSISTENCY CHECK WITH DETAILED CALCULATIONS =====
  data.push([createStyledCell("Consistency Check", theme.headerStyle)])
  currentRow++

  // Add explanation
  data.push([
    createStyledCell(
      "Consistency check determines if the pairwise comparisons are logically consistent. CR ≤ 0.1 is considered acceptable.",
      theme.explanationStyle,
    ),
  ])
  currentRow++

  // Lambda Max calculation
  const lambdaMaxRow = currentRow + 1
  data.push([
    createStyledCell("Lambda Max (λmax)"),
    {
      f: `ROUND(AVERAGE(${getExcelColumn(3)}${weightedSumStartRow + 1}:${getExcelColumn(3)}${weightedSumStartRow + criteria.length}),3)`,
      t: "n",
      s: theme.resultStyle,
    },
    createStyledCell("Average of the ratio values (Aw/w)", theme.explanationStyle),
  ])
  currentRow++

  // Consistency Index calculation with formula
  data.push([
    createStyledCell("Consistency Index (CI)"),
    {
      f: `ROUND((${getExcelColumn(1)}${lambdaMaxRow}-${criteria.length})/(${criteria.length}-1),3)`,
      t: "n",
      s: theme.resultStyle,
    },
    createStyledCell(`Formula: CI = (λmax - n)/(n - 1) where n = ${criteria.length}`, theme.explanationStyle),
  ])
  currentRow++

  // Random Index
  data.push([
    createStyledCell("Random Index (RI)"),
    createStyledCell(roundToThreeDecimals(criteriaPairwise.randomIndex)),
    createStyledCell(`Standard value for matrix size ${criteria.length}x${criteria.length}`, theme.explanationStyle),
  ])
  currentRow++

  // Consistency Ratio calculation with formula
  data.push([
    createStyledCell("Consistency Ratio (CR)"),
    {
      f: `ROUND(${getExcelColumn(1)}${lambdaMaxRow + 1}/${getExcelColumn(1)}${lambdaMaxRow + 2},3)`,
      t: "n",
      s: theme.resultStyle,
    },
    createStyledCell("Formula: CR = CI/RI", theme.explanationStyle),
  ])
  currentRow++

  // Consistency status
  const crRow = lambdaMaxRow + 3
  data.push([
    createStyledCell("Status"),
    {
      f: `IF(${getExcelColumn(1)}${crRow}<0.1,"Consistent","Inconsistent")`,
      t: "s",
      s: { font: { bold: true }, fill: { fgColor: { rgb: criteriaPairwise.isConsistent ? "A9DFBF" : "F5B7B1" } } },
    },
    createStyledCell("CR ≤ 0.1 indicates consistent judgments", theme.explanationStyle),
  ])
  currentRow++

  data.push([]) // Empty row
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // ===== ALTERNATIVE PAIRWISE COMPARISONS =====

  data.push([
    createStyledCell("3. ALTERNATIVE PAIRWISE COMPARISONS", {
      font: { bold: true, sz: 14, color: { rgb: theme.headerStyle.fill.fgColor.rgb } },
    }),
  ])
  currentRow++
  data.push([])
  currentRow++

  // For each criterion, add alternative comparison
  criteria.forEach((criterion, criterionIndex) => {
    const matrix = alternativesPairwise.find((m) => m.criterionId === criterion.id)
    if (!matrix) return

    data.push([createStyledCell(`Alternative Comparison for ${criterion.name}`, theme.headerStyle)])
    currentRow++

    // Header row with alternative names
    const altHeaderRow = [createStyledCell("Alternative", theme.subheaderStyle)]
    alternatives.forEach((alt) => {
      altHeaderRow.push(createStyledCell(alt.name, theme.subheaderStyle))
    })
    data.push(altHeaderRow)
    currentRow++

    // Matrix rows
    const altMatrixStartRow = currentRow
    alternatives.forEach((rowAlt, rowIndex) => {
      const row = [createStyledCell(rowAlt.name)]
      alternatives.forEach((colAlt, colIndex) => {
        if (rowIndex === colIndex) {
          row.push(createStyledCell(1))
        } else {
          // Round the matrix value to 3 decimal places
          row.push(createStyledCell(roundToThreeDecimals(matrix.matrix[rowIndex][colIndex])))
        }
      })
      data.push(row)
      currentRow++
    })

    // Add sum row
    const altSumRow = [createStyledCell("SUM", theme.sumStyle)]
    for (let j = 0; j < alternatives.length; j++) {
      const colLetter = getExcelColumn(j + 1)
      const formula = `ROUND(SUM(${colLetter}${altMatrixStartRow + 1}:${colLetter}${altMatrixStartRow + alternatives.length}),3)`
      altSumRow.push({
        f: formula,
        t: "n",
        s: theme.sumStyle,
      })
    }
    data.push(altSumRow)
    currentRow++

    data.push([]) // Empty row
    currentRow++

    // Normalized matrix
    data.push([createStyledCell(`Normalized Matrix for ${criterion.name}`, theme.headerStyle)])
    currentRow++

    // Header row for normalized matrix
    const altNormHeaderRow = [createStyledCell("Alternative", theme.subheaderStyle)]
    alternatives.forEach((alt) => {
      altNormHeaderRow.push(createStyledCell(alt.name, theme.subheaderStyle))
    })
    altNormHeaderRow.push(createStyledCell("Priority", theme.subheaderStyle))
    data.push(altNormHeaderRow)
    currentRow++

    // Add normalized matrix rows with formulas
    const altNormalizedStartRow = currentRow
    alternatives.forEach((rowAlt, rowIndex) => {
      const row = [createStyledCell(rowAlt.name)]

      // Add normalized values with formulas
      alternatives.forEach((colAlt, colIndex) => {
        const cellRef = getExcelColumn(colIndex + 1) + (altMatrixStartRow + rowIndex + 1)
        const sumRef = getExcelColumn(colIndex + 1) + (altMatrixStartRow + alternatives.length + 1)

        // Create a formula cell that divides the original value by the column sum and rounds to 3 decimal places
        const formula = `ROUND(${cellRef}/${sumRef},3)`
        row.push({
          f: formula,
          t: "n",
          s: theme.formulaStyle,
        })
      })

      // Add priority vector (row average) formula with rounding
      const rowStart = getExcelColumn(1) + (altNormalizedStartRow + rowIndex + 1)
      const rowEnd = getExcelColumn(alternatives.length) + (altNormalizedStartRow + rowIndex + 1)
      const formula = `ROUND(AVERAGE(${rowStart}:${rowEnd}),3)`
      row.push({
        f: formula,
        t: "n",
        s: theme.resultStyle,
      })

      data.push(row)
      currentRow++
    })

    // Add sum row for verification
    const altNormSumRow = [createStyledCell("SUM", theme.sumStyle)]
    for (let j = 0; j < alternatives.length; j++) {
      const colLetter = getExcelColumn(j + 1)
      const formula = `ROUND(SUM(${colLetter}${altNormalizedStartRow + 1}:${colLetter}${altNormalizedStartRow + alternatives.length}),3)`
      altNormSumRow.push({
        f: formula,
        t: "n",
        s: theme.sumStyle,
      })
    }

    // Add sum of priorities (should be 1)
    const altPriorityCol = getExcelColumn(alternatives.length + 1)
    const altPrioritySumFormula = `ROUND(SUM(${altPriorityCol}${altNormalizedStartRow + 1}:${altPriorityCol}${altNormalizedStartRow + alternatives.length}),3)`
    altNormSumRow.push({
      f: altPrioritySumFormula,
      t: "n",
      s: theme.sumStyle,
    })

    data.push(altNormSumRow)
    currentRow++

    data.push([]) // Empty row
    currentRow++

    // ===== WEIGHTED SUM VECTOR FOR ALTERNATIVES =====
    data.push([createStyledCell(`Weighted Sum Vector for ${criterion.name}`, theme.headerStyle)])
    currentRow++

    // Add explanation
    data.push([
      createStyledCell(
        "The weighted sum vector is calculated by multiplying the pairwise comparison matrix by the priority vector.",
        theme.explanationStyle,
      ),
    ])
    currentRow++

    // Header row for weighted sum calculation
    const altWsHeaderRow = [createStyledCell("Alternative", theme.subheaderStyle)]
    altWsHeaderRow.push(createStyledCell("Priority (w)", theme.subheaderStyle))
    altWsHeaderRow.push(createStyledCell("Weighted Sum (Aw)", theme.subheaderStyle))
    altWsHeaderRow.push(createStyledCell("Ratio (Aw/w)", theme.subheaderStyle))
    data.push(altWsHeaderRow)
    currentRow++

    // Store the starting row for weighted sum calculations
    const altWeightedSumStartRow = currentRow

    // Add weighted sum calculations for each alternative
    alternatives.forEach((alternative, rowIndex) => {
      const row = [createStyledCell(alternative.name)]

      // Priority vector value
      const altPriorityRef = getExcelColumn(alternatives.length + 1) + (altNormalizedStartRow + rowIndex + 1)
      row.push({
        f: altPriorityRef,
        t: "n",
        s: theme.formulaStyle,
      })

      // Weighted Sum calculation (Aw)
      // Formula: Sum of (each matrix value * corresponding priority)
      let altWsFormula = ""
      for (let j = 0; j < alternatives.length; j++) {
        const altMatrixCellRef = getExcelColumn(j + 1) + (altMatrixStartRow + rowIndex + 1)
        const altPriorityCellRef = getExcelColumn(alternatives.length + 1) + (altNormalizedStartRow + j + 1)

        if (j > 0) altWsFormula += "+"
        altWsFormula += `${altMatrixCellRef}*${altPriorityCellRef}`
      }

      row.push({
        f: `ROUND(${altWsFormula},3)`,
        t: "n",
        s: theme.formulaStyle,
      })

      // Ratio (Aw/w) - This is used to calculate Lambda Max
      row.push({
        f: `ROUND(${getExcelColumn(2)}${altWeightedSumStartRow + rowIndex + 1}/${getExcelColumn(1)}${altWeightedSumStartRow + rowIndex + 1},3)`,
        t: "n",
        s: theme.resultStyle,
      })

      data.push(row)
      currentRow++
    })

    data.push([]) // Empty row
    currentRow++

    // Consistency check for alternatives
    data.push([createStyledCell(`Consistency Check for ${criterion.name}`, theme.headerStyle)])
    currentRow++

    // Lambda Max calculation
    const altLambdaMaxRow = currentRow + 1
    data.push([
      createStyledCell("Lambda Max (λmax)"),
      {
        f: `ROUND(AVERAGE(${getExcelColumn(3)}${altWeightedSumStartRow + 1}:${getExcelColumn(3)}${altWeightedSumStartRow + alternatives.length}),3)`,
        t: "n",
        s: theme.resultStyle,
      },
      createStyledCell("Average of the ratio values (Aw/w)", theme.explanationStyle),
    ])
    currentRow++

    // Consistency Index calculation with formula
    data.push([
      createStyledCell("Consistency Index (CI)"),
      {
        f: `ROUND((${getExcelColumn(1)}${altLambdaMaxRow}-${alternatives.length})/(${alternatives.length}-1),3)`,
        t: "n",
        s: theme.resultStyle,
      },
      createStyledCell(`Formula: CI = (λmax - n)/(n - 1) where n = ${alternatives.length}`, theme.explanationStyle),
    ])
    currentRow++

    // Random Index
    data.push([
      createStyledCell("Random Index (RI)"),
      createStyledCell(roundToThreeDecimals(matrix.randomIndex)),
      createStyledCell(
        `Standard value for matrix size ${alternatives.length}x${alternatives.length}`,
        theme.explanationStyle,
      ),
    ])
    currentRow++

    // Consistency Ratio calculation with formula
    data.push([
      createStyledCell("Consistency Ratio (CR)"),
      {
        f: `ROUND(${getExcelColumn(1)}${altLambdaMaxRow + 1}/${getExcelColumn(1)}${altLambdaMaxRow + 2},3)`,
        t: "n",
        s: theme.resultStyle,
      },
      createStyledCell("Formula: CR = CI/RI", theme.explanationStyle),
    ])
    currentRow++

    // Consistency status
    const altCrRow = altLambdaMaxRow + 3
    data.push([
      createStyledCell("Status"),
      {
        f: `IF(${getExcelColumn(1)}${altCrRow}<0.1,"Consistent","Inconsistent")`,
        t: "s",
        s: { font: { bold: true }, fill: { fgColor: { rgb: matrix.isConsistent ? "A9DFBF" : "F5B7B1" } } },
      },
      createStyledCell("CR ≤ 0.1 indicates consistent judgments", theme.explanationStyle),
    ])
    currentRow++

    data.push([]) // Empty row
    currentRow++
    data.push([]) // Empty row
    currentRow++
  })

  // ===== FINAL RANKING =====

  data.push([
    createStyledCell("4. FINAL RANKING AND RESULTS", {
      font: { bold: true, sz: 14, color: { rgb: theme.headerStyle.fill.fgColor.rgb } },
    }),
  ])
  currentRow++
  data.push([])
  currentRow++

  // Criteria weights section
  data.push([createStyledCell("Criteria Weights", theme.headerStyle)])
  currentRow++

  // Header row
  data.push([createStyledCell("Criterion", theme.subheaderStyle), createStyledCell("Weight", theme.subheaderStyle)])
  currentRow++

  // Store the starting row for criteria weights
  const criteriaWeightsStartRow = currentRow

  // Criteria weights
  criteria.forEach((criterion, index) => {
    // Reference the priority vector from the normalized matrix with rounding
    const priorityRef = getExcelColumn(criteria.length + 1) + (normalizedStartRow + index + 1)
    data.push([
      createStyledCell(criterion.name),
      {
        f: `ROUND(${priorityRef},3)`,
        t: "n",
        s: theme.resultStyle,
      },
    ])
    currentRow++
  })

  // Add sum row for verification
  data.push([
    createStyledCell("SUM", theme.sumStyle),
    {
      f: `ROUND(SUM(${getExcelColumn(1)}${criteriaWeightsStartRow + 1}:${getExcelColumn(1)}${criteriaWeightsStartRow + criteria.length}),3)`,
      t: "n",
      s: theme.sumStyle,
    },
  ])
  currentRow++

  data.push([]) // Empty row
  currentRow++

  // Alternative scores by criterion
  data.push([createStyledCell("Alternative Scores by Criterion", theme.headerStyle)])
  currentRow++

  // Header row
  const finalHeaderRow = [createStyledCell("Alternative", theme.subheaderStyle)]
  criteria.forEach((criterion) => {
    finalHeaderRow.push(createStyledCell(criterion.name, theme.subheaderStyle))
  })
  finalHeaderRow.push(createStyledCell("Overall Score", theme.subheaderStyle))
  data.push(finalHeaderRow)
  currentRow++

  // Store the starting row for final scores
  const finalScoresStartRow = currentRow

  // Alternative scores
  alternatives.forEach((alternative, altIndex) => {
    const row = [createStyledCell(alternative.name)]

    // Add scores for each criterion with rounding
    criteria.forEach((criterion, critIndex) => {
      const matrix = alternativesPairwise.find((m) => m.criterionId === criterion.id)
      if (matrix) {
        row.push(createStyledCell(roundToThreeDecimals(matrix.priorityVector[altIndex]), theme.formulaStyle))
      } else {
        row.push(createStyledCell(0))
      }
    })

    // Add overall score formula with rounding and detailed calculation
    let formula = ""
    for (let i = 0; i < criteria.length; i++) {
      const criterionWeight = getExcelColumn(1) + (criteriaWeightsStartRow + i + 1)
      const altScore = getExcelColumn(i + 1) + (finalScoresStartRow + altIndex + 1)

      if (i > 0) formula += "+"
      formula += `${altScore}*${criterionWeight}`
    }

    // Wrap the entire formula in ROUND function
    formula = `ROUND(${formula},3)`

    row.push({
      f: formula,
      t: "n",
      s: theme.resultStyle,
    })

    data.push(row)
    currentRow++
  })

  data.push([]) // Empty row
  currentRow++

  // Final ranking
  data.push([createStyledCell("Final Ranking", theme.headerStyle)])
  currentRow++
  data.push([
    createStyledCell("Rank", theme.subheaderStyle),
    createStyledCell("Alternative", theme.subheaderStyle),
    createStyledCell("Score", theme.subheaderStyle),
    createStyledCell("Calculation", theme.subheaderStyle),
  ])
  currentRow++

  // Create a reference to the overall scores
  const scoreCol = getExcelColumn(criteria.length + 1)

  // Add ranking with RANK formula
  alternatives.forEach((alternative, index) => {
    // Create calculation explanation
    let calcExplanation = `${alternative.name} score = `
    for (let i = 0; i < criteria.length; i++) {
      const matrix = alternativesPairwise.find((m) => m.criterionId === criteria[i].id)
      const altScore = matrix ? roundToThreeDecimals(matrix.priorityVector[index]) : 0
      const critWeight = roundToThreeDecimals(criteriaPairwise.priorityVector[i])

      if (i > 0) calcExplanation += " + "
      calcExplanation += `(${altScore} × ${critWeight})`
    }

    const row = [
      {
        f: `RANK(${scoreCol}${finalScoresStartRow + index + 1},${scoreCol}${finalScoresStartRow + 1}:${scoreCol}${finalScoresStartRow + alternatives.length})`,
        t: "n",
        s: theme.resultStyle,
      },
      createStyledCell(alternative.name),
      {
        f: `ROUND(${scoreCol}${finalScoresStartRow + index + 1},3)`,
        t: "n",
        s: theme.resultStyle,
      },
      createStyledCell(calcExplanation, theme.explanationStyle),
    ]
    data.push(row)
    currentRow++
  })

  // Convert data to worksheet
  const maxCols = Math.max(...data.map((row) => row.length))
  const range = { s: { c: 0, r: 0 }, e: { c: maxCols - 1, r: data.length - 1 } }
  ws["!ref"] = XLSX.utils.encode_range(range)

  // Add data to worksheet
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j]) {
        const cell_address = { c: j, r: i }
        const cell_ref = XLSX.utils.encode_cell(cell_address)
        ws[cell_ref] = data[i][j]
      }
    }
  }

  // Set column widths
  const colWidths = [{ wch: 20 }] // First column wider for labels
  for (let i = 0; i < Math.max(criteria.length, alternatives.length); i++) {
    colWidths.push({ wch: 15 })
  }
  // Make explanation columns wider
  colWidths.push({ wch: 40 })
  colWidths.push({ wch: 40 })
  ws["!cols"] = colWidths

  return ws
}

// ===== LAYOUT 3: VISUAL LAYOUT (PURPLE THEME) =====

function createVisualLayout(
  XLSX: any,
  criteria: Criterion[],
  alternatives: Alternative[],
  criteriaPairwise: PairwiseMatrix,
  alternativesPairwise: AlternativeMatrix[],
  finalRanking: { alternativeId: string; score: number }[],
  theme: any,
): any {
  const ws: any = {}
  const data: any[][] = []
  let currentRow = 0

  // Title with larger font and centered
  data.push([
    createStyledCell("AHP ANALYSIS - VISUAL FORMAT", {
      font: { bold: true, sz: 18, color: { rgb: theme.titleStyle.font.color.rgb } },
      alignment: { horizontal: "center" },
    }),
  ])
  currentRow++

  // Add date
  const today = new Date()
  data.push([
    createStyledCell(`Generated on: ${today.toLocaleDateString()}`, {
      font: { italic: true },
      alignment: { horizontal: "center" },
    }),
  ])
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // ===== OVERVIEW SECTION =====

  // Create a side-by-side layout for criteria and alternatives
  data.push([
    createStyledCell("CRITERIA", theme.headerStyle),
    null,
    null,
    createStyledCell("ALTERNATIVES", theme.headerStyle),
  ])
  currentRow++

  data.push([
    createStyledCell("ID", theme.subheaderStyle),
    createStyledCell("Name", theme.subheaderStyle),
    null,
    createStyledCell("ID", theme.subheaderStyle),
    createStyledCell("Name", theme.subheaderStyle),
  ])
  currentRow++

  // Determine the max length between criteria and alternatives
  const maxLength = Math.max(criteria.length, alternatives.length)

  for (let i = 0; i < maxLength; i++) {
    const row = []

    // Add criterion if exists
    if (i < criteria.length) {
      row.push(createStyledCell(criteria[i].id))
      row.push(createStyledCell(criteria[i].name))
    } else {
      row.push(null)
      row.push(null)
    }

    // Add spacer
    row.push(null)

    // Add alternative if exists
    if (i < alternatives.length) {
      row.push(createStyledCell(alternatives[i].id))
      row.push(createStyledCell(alternatives[i].name))
    } else {
      row.push(null)
      row.push(null)
    }

    data.push(row)
    currentRow++
  }

  data.push([]) // Empty row
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // ===== CRITERIA WEIGHTS VISUALIZATION =====

  data.push([createStyledCell("CRITERIA WEIGHTS", theme.headerStyle)])
  currentRow++

  // Header row
  data.push([
    createStyledCell("Criterion", theme.subheaderStyle),
    createStyledCell("Weight", theme.subheaderStyle),
    createStyledCell("Visual Representation", theme.subheaderStyle),
  ])
  currentRow++

  // Criteria weights with visual bars
  criteria.forEach((criterion, index) => {
    const weight = criteriaPairwise.priorityVector[index]
    const visualBar = "█".repeat(Math.round(weight * 50)) // Create a visual bar using block characters

    data.push([
      createStyledCell(criterion.name),
      createStyledCell(weight, theme.resultStyle),
      createStyledCell(visualBar, {
        font: { color: { rgb: theme.headerStyle.fill.fgColor.rgb } },
      }),
    ])
    currentRow++
  })

  data.push([]) // Empty row
  currentRow++

  // ===== FINAL RANKING VISUALIZATION =====

  data.push([createStyledCell("FINAL RANKING", theme.headerStyle)])
  currentRow++

  // Header row
  data.push([
    createStyledCell("Rank", theme.subheaderStyle),
    createStyledCell("Alternative", theme.subheaderStyle),
    createStyledCell("Score", theme.subheaderStyle),
    createStyledCell("Visual Representation", theme.subheaderStyle),
  ])
  currentRow++

  // Sort alternatives by score
  const sortedAlternatives = [...alternatives].sort((a, b) => {
    const scoreA = finalRanking.find((r) => r.alternativeId === a.id)?.score || 0
    const scoreB = finalRanking.find((r) => r.alternativeId === b.id)?.score || 0
    return scoreB - scoreA
  })

  // Find max score for scaling
  const maxScore = Math.max(...finalRanking.map((r) => r.score))

  // Add ranking with visual bars
  sortedAlternatives.forEach((alternative, index) => {
    const ranking = finalRanking.find((r) => r.alternativeId === alternative.id)
    const score = ranking ? ranking.score : 0
    const visualBar = "█".repeat(Math.round((score / maxScore) * 50)) // Scale to max score

    data.push([
      createStyledCell(index + 1, theme.resultStyle),
      createStyledCell(alternative.name),
      createStyledCell(score, theme.resultStyle),
      createStyledCell(visualBar, {
        font: { color: { rgb: theme.headerStyle.fill.fgColor.rgb } },
      }),
    ])
    currentRow++
  })

  data.push([]) // Empty row
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // ===== CONSISTENCY INFORMATION =====

  data.push([createStyledCell("CONSISTENCY INFORMATION", theme.headerStyle)])
  currentRow++

  // Criteria consistency
  data.push([
    createStyledCell("Criteria Consistency Ratio:"),
    createStyledCell(criteriaPairwise.consistencyRatio, theme.resultStyle),
    createStyledCell(criteriaPairwise.consistencyRatio <= 0.1 ? "✓ Consistent" : "✗ Inconsistent", {
      font: { bold: true },
      fill: {
        fgColor: { rgb: criteriaPairwise.consistencyRatio <= 0.1 ? "A9DFBF" : "F5B7B1" },
      },
    }),
  ])
  currentRow++

  // Alternative consistencies
  data.push([createStyledCell("Alternative Consistency Ratios:", theme.subheaderStyle)])
  currentRow++

  criteria.forEach((criterion) => {
    const matrix = alternativesPairwise.find((m) => m.criterionId === criterion.id)
    if (!matrix) return

    data.push([
      createStyledCell(`${criterion.name}:`),
      createStyledCell(matrix.consistencyRatio, theme.resultStyle),
      createStyledCell(matrix.consistencyRatio <= 0.1 ? "✓ Consistent" : "✗ Inconsistent", {
        font: { bold: true },
        fill: {
          fgColor: { rgb: matrix.consistencyRatio <= 0.1 ? "A9DFBF" : "F5B7B1" },
        },
      }),
    ])
    currentRow++
  })

  data.push([]) // Empty row
  currentRow++

  // ===== ALTERNATIVE SCORES BY CRITERION =====

  data.push([createStyledCell("ALTERNATIVE SCORES BY CRITERION", theme.headerStyle)])
  currentRow++

  // Header row
  const headerRow = [createStyledCell("Alternative", theme.subheaderStyle)]
  criteria.forEach((criterion) => {
    headerRow.push(createStyledCell(criterion.name, theme.subheaderStyle))
  })
  headerRow.push(createStyledCell("Overall Score", theme.subheaderStyle))
  data.push(headerRow)
  currentRow++

  // Alternative scores
  sortedAlternatives.forEach((alternative) => {
    const row = [createStyledCell(alternative.name)]

    // Add scores for each criterion
    criteria.forEach((criterion) => {
      const matrix = alternativesPairwise.find((m) => m.criterionId === criterion.id)
      const altIndex = alternatives.findIndex((a) => a.id === alternative.id)
      if (matrix && altIndex >= 0) {
        row.push(createStyledCell(matrix.priorityVector[altIndex], theme.formulaStyle))
      } else {
        row.push(createStyledCell(0))
      }
    })

    // Add overall score
    const ranking = finalRanking.find((r) => r.alternativeId === alternative.id)
    row.push(createStyledCell(ranking ? ranking.score : 0, theme.resultStyle))

    data.push(row)
    currentRow++
  })

  // Convert data to worksheet
  const maxCols = Math.max(...data.map((row) => row.length))
  const range = { s: { c: 0, r: 0 }, e: { c: maxCols - 1, r: data.length - 1 } }
  ws["!ref"] = XLSX.utils.encode_range(range)

  // Add data to worksheet
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j]) {
        const cell_address = { c: j, r: i }
        const cell_ref = XLSX.utils.encode_cell(cell_address)
        ws[cell_ref] = data[i][j]
      }
    }
  }

  // Set column widths
  const colWidths = [{ wch: 20 }] // First column wider for labels
  for (let i = 0; i < Math.max(criteria.length, alternatives.length) + 3; i++) {
    colWidths.push({ wch: 15 })
  }
  // Make the visual representation column wider
  colWidths.push({ wch: 60 })
  ws["!cols"] = colWidths

  return ws
}

// ===== LAYOUT 4: PRESENTATION LAYOUT (ORANGE THEME) =====

function createPresentationLayout(
  XLSX: any,
  criteria: Criterion[],
  alternatives: Alternative[],
  criteriaPairwise: PairwiseMatrix,
  alternativesPairwise: AlternativeMatrix[],
  finalRanking: { alternativeId: string; score: number }[],
  theme: any,
): any {
  const ws: any = {}
  const data: any[][] = []
  let currentRow = 0

  // Title with large font and centered
  data.push([
    createStyledCell("AHP DECISION ANALYSIS", {
      font: { bold: true, sz: 22, color: { rgb: theme.titleStyle.font.color.rgb } },
      alignment: { horizontal: "center" },
    }),
  ])
  currentRow++

  // Subtitle
  data.push([
    createStyledCell("Analytic Hierarchy Process Results", {
      font: { bold: true, italic: true, sz: 14 },
      alignment: { horizontal: "center" },
    }),
  ])
  currentRow++

  // Add date
  const today = new Date()
  data.push([
    createStyledCell(`Generated on: ${today.toLocaleDateString()}`, {
      font: { italic: true },
      alignment: { horizontal: "center" },
    }),
  ])
  currentRow++
  data.push([]) // Empty row
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // ===== EXECUTIVE SUMMARY =====

  data.push([
    createStyledCell("EXECUTIVE SUMMARY", {
      font: { bold: true, sz: 16, color: { rgb: theme.headerStyle.fill.fgColor.rgb } },
      alignment: { horizontal: "center" },
      border: { bottom: { style: "medium", color: { rgb: theme.headerStyle.fill.fgColor.rgb } } },
    }),
  ])
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // Top alternative
  const topAlternative = alternatives.find((a) => a.id === finalRanking[0]?.alternativeId)

  data.push([
    createStyledCell("Decision Problem:", { font: { bold: true } }),
    createStyledCell("Selection among multiple alternatives using AHP methodology"),
  ])
  currentRow++

  data.push([createStyledCell("Number of Criteria:", { font: { bold: true } }), createStyledCell(criteria.length)])
  currentRow++

  data.push([
    createStyledCell("Number of Alternatives:", { font: { bold: true } }),
    createStyledCell(alternatives.length),
  ])
  currentRow++

  data.push([
    createStyledCell("Top Ranked Alternative:", { font: { bold: true } }),
    createStyledCell(topAlternative ? topAlternative.name : "N/A", {
      font: { bold: true, color: { rgb: theme.titleStyle.font.color.rgb } },
    }),
  ])
  currentRow++

  data.push([
    createStyledCell("Top Alternative Score:", { font: { bold: true } }),
    createStyledCell(finalRanking[0]?.score || 0, { font: { bold: true } }),
  ])
  currentRow++

  data.push([
    createStyledCell("Overall Consistency:", { font: { bold: true } }),
    createStyledCell(criteriaPairwise.consistencyRatio <= 0.1 ? "Acceptable" : "Review Recommended", {
      font: { bold: true },
      fill: {
        fgColor: { rgb: criteriaPairwise.consistencyRatio <= 0.1 ? "A9DFBF" : "F5B7B1" },
      },
    }),
  ])
  currentRow++

  data.push([]) // Empty row
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // ===== FINAL RANKING =====

  data.push([
    createStyledCell("FINAL RANKING", {
      font: { bold: true, sz: 16, color: { rgb: theme.headerStyle.fill.fgColor.rgb } },
      alignment: { horizontal: "center" },
      border: { bottom: { style: "medium", color: { rgb: theme.headerStyle.fill.fgColor.rgb } } },
    }),
  ])
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // Header row
  data.push([
    createStyledCell("Rank", theme.subheaderStyle),
    createStyledCell("Alternative", theme.subheaderStyle),
    createStyledCell("Score", theme.subheaderStyle),
    createStyledCell("Percentage", theme.subheaderStyle),
  ])
  currentRow++

  // Calculate total score for percentage
  const totalScore = finalRanking.reduce((sum, item) => sum + item.score, 0)

  // Add ranking
  finalRanking.forEach((item, index) => {
    const alt = alternatives.find((a) => a.id === item.alternativeId)
    const percentage = (item.score / totalScore) * 100

    data.push([
      createStyledCell(index + 1, theme.resultStyle),
      createStyledCell(alt ? alt.name : item.alternativeId),
      createStyledCell(item.score, theme.resultStyle),
      createStyledCell(`${percentage.toFixed(2)}%`, theme.resultStyle),
    ])
    currentRow++
  })

  data.push([]) // Empty row
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // ===== CRITERIA WEIGHTS =====

  data.push([
    createStyledCell("CRITERIA WEIGHTS", {
      font: { bold: true, sz: 16, color: { rgb: theme.headerStyle.fill.fgColor.rgb } },
      alignment: { horizontal: "center" },
      border: { bottom: { style: "medium", color: { rgb: theme.headerStyle.fill.fgColor.rgb } } },
    }),
  ])
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // Header row
  data.push([
    createStyledCell("Criterion", theme.subheaderStyle),
    createStyledCell("Weight", theme.subheaderStyle),
    createStyledCell("Percentage", theme.subheaderStyle),
  ])
  currentRow++

  // Sort criteria by weight
  const sortedCriteria = [...criteria].sort((a, b) => {
    const indexA = criteria.findIndex((c) => c.id === a.id)
    const indexB = criteria.findIndex((c) => c.id === b.id)
    return criteriaPairwise.priorityVector[indexB] - criteriaPairwise.priorityVector[indexA]
  })

  // Criteria weights
  sortedCriteria.forEach((criterion) => {
    const index = criteria.findIndex((c) => c.id === criterion.id)
    const weight = criteriaPairwise.priorityVector[index]
    const percentage = weight * 100

    data.push([
      createStyledCell(criterion.name),
      createStyledCell(weight, theme.resultStyle),
      createStyledCell(`${percentage.toFixed(2)}%`, theme.resultStyle),
    ])
    currentRow++
  })

  data.push([]) // Empty row
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // ===== ALTERNATIVE PERFORMANCE BY CRITERION =====

  data.push([
    createStyledCell("ALTERNATIVE PERFORMANCE BY CRITERION", {
      font: { bold: true, sz: 16, color: { rgb: theme.headerStyle.fill.fgColor.rgb } },
      alignment: { horizontal: "center" },
      border: { bottom: { style: "medium", color: { rgb: theme.headerStyle.fill.fgColor.rgb } } },
    }),
  ])
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // Header row
  const perfHeaderRow = [createStyledCell("Alternative", theme.subheaderStyle)]
  criteria.forEach((criterion) => {
    perfHeaderRow.push(createStyledCell(criterion.name, theme.subheaderStyle))
  })
  perfHeaderRow.push(createStyledCell("Overall", theme.subheaderStyle))
  data.push(perfHeaderRow)
  currentRow++

  // Alternative performance
  alternatives.forEach((alternative) => {
    const row = [createStyledCell(alternative.name)]

    // Add performance for each criterion
    criteria.forEach((criterion) => {
      const matrix = alternativesPairwise.find((m) => m.criterionId === criterion.id)
      const altIndex = alternatives.findIndex((a) => a.id === alternative.id)
      if (matrix && altIndex >= 0) {
        row.push(createStyledCell(matrix.priorityVector[altIndex], theme.formulaStyle))
      } else {
        row.push(createStyledCell(0))
      }
    })

    // Add overall score
    const ranking = finalRanking.find((r) => r.alternativeId === alternative.id)
    row.push(createStyledCell(ranking ? ranking.score : 0, theme.resultStyle))

    data.push(row)
    currentRow++
  })

  data.push([]) // Empty row
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // ===== CONCLUSION =====

  data.push([
    createStyledCell("CONCLUSION", {
      font: { bold: true, sz: 16, color: { rgb: theme.headerStyle.fill.fgColor.rgb } },
      alignment: { horizontal: "center" },
      border: { bottom: { style: "medium", color: { rgb: theme.headerStyle.fill.fgColor.rgb } } },
    }),
  ])
  currentRow++
  data.push([]) // Empty row
  currentRow++

  // Conclusion text
  data.push([createStyledCell("Based on the AHP analysis, the recommended decision is:", { font: { bold: true } })])
  currentRow++

  data.push([
    createStyledCell(`Select "${topAlternative ? topAlternative.name : "N/A"}" as the preferred alternative.`, {
      font: { bold: true, sz: 14, color: { rgb: theme.titleStyle.font.color.rgb } },
      alignment: { horizontal: "center" },
    }),
  ])
  currentRow++

  data.push([]) // Empty row
  currentRow++

  data.push([
    createStyledCell(
      "This recommendation is based on the criteria weights and pairwise comparisons provided in the analysis.",
      {
        alignment: { horizontal: "center" },
      },
    ),
  ])
  currentRow++

  // Convert data to worksheet
  const maxCols = Math.max(...data.map((row) => row.length))
  const range = { s: { c: 0, r: 0 }, e: { c: maxCols - 1, r: data.length - 1 } }
  ws["!ref"] = XLSX.utils.encode_range(range)

  // Add data to worksheet
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j]) {
        const cell_address = { c: j, r: i }
        const cell_ref = XLSX.utils.encode_cell(cell_address)
        ws[cell_ref] = data[i][j]
      }
    }
  }

  // Set column widths
  const colWidths = [{ wch: 20 }] // First column wider for labels
  for (let i = 0; i < Math.max(criteria.length, alternatives.length) + 2; i++) {
    colWidths.push({ wch: 15 })
  }
  ws["!cols"] = colWidths

  return ws
}
