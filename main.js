const ctx = document.getElementById("myChart");
const ctx2 = document.getElementById("myChart2");

const input = document.getElementById("excelInput");

let chart = null;

input.addEventListener("change", handleFile);

async function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  console.log("rows:", rows);

  const series = rows
    .map((row) =>
      row.filter((v) => v !== undefined && v !== null && v !== "").map(Number)
    )
    .filter((arr) => arr.length > 0);

  if (series.length === 0) {
    console.log("В таблице нет непустых строк");
    return;
  }

  const maxLen = Math.max(...series.map((arr) => arr.length));
  const labels = Array.from({ length: maxLen }, (_, i) => i + 1);

  const colors = ["orange", "purple", "brown", "green", "red", "blue"];
  const datasets = series.map((data, index) => {
    const color = colors[index % colors.length];
    return {
      label: `Строка ${index + 1}`,
      data,
      borderColor: color,
      pointBackgroundColor: color,
      borderWidth: 4,
      pointHoverRadius: 7,
      pointRadius: 4,
      backgroundColor: "rgba(255, 255, 255, 0.82)",
      borderRadius: 3,
      pointStyle: "triangle",
    };
  });

  console.log("datasets:", datasets);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets,
    },
    options: {
      animation: {
        duration: 800,
        easing: "easeOutQuart",
      },
      responsive: true,
      scales: {
        x: {
          ticks: {
            color: "#f0f0f0",
            font: {
              size: 16,
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.46)",
            lineWidth: 1,
            drawOnChartArea: true,
            drawTicks: true,
            borderColor: "#fb0000ff",
            borderWidth: 1,
          },
        },
        y: {
          ticks: {
            color: "#f0f0f0",
            font: {
              size: 16,
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.46)",
            lineWidth: 1,
            drawOnChartArea: true,
            drawTicks: true,
            borderColor: "#fb0000ff",
            borderWidth: 1,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
            font: {
              size: 20,
            },
          },
        },
      },
    },
  });

  const chart2 = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            color: "#f0f0f0",
            font: {
              size: 16,
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.46)",
            lineWidth: 1,
            drawOnChartArea: true,
            drawTicks: true,
            borderColor: "#fb0000ff",
            borderWidth: 1,
          },
        },
        y: {
          ticks: {
            color: "#f0f0f0",
            font: {
              size: 16,
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.46)",
            lineWidth: 1,
            drawOnChartArea: true,
            drawTicks: true,
            borderColor: "#fb0000ff",
            borderWidth: 1,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
            font: {
              size: 20,
            },
          },
        },
      },
    },
  });
}
