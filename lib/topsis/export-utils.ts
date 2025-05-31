import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Export an HTML element to PDF
 * @param elementId The ID of the HTML element to export
 * @param filename The name of the PDF file (without extension)
 */
export async function exportToPDF(
  elementId: string,
  filename: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  try {
    // Create a canvas from the element
    const canvas = await html2canvas(element, {
      scale: 1.5, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      backgroundColor: "#ffffff", // White background
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Calculate dimensions to fit the content
    const imgWidth = 210; // A4 width in mm (210mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the image to the PDF
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // If content is longer than one page, add more pages
    let heightLeft = imgHeight;
    let position = 0;
    const pageHeight = 295; // A4 height in mm (297mm - margins)

    while (heightLeft > pageHeight) {
      position = heightLeft - pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
