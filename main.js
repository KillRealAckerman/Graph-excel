const ctx = document.getElementById("myChart");
const ctx2 = document.getElementById("myChart2");

const input = document.getElementById("excelInput");

let chart = null; // здесь будем хранить один общий Chart

input.addEventListener("change", handleFile);

async function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  console.log("rows:", rows);

  // превращаем КАЖДУЮ строку в массив чисел
  const series = rows
    .map((row) =>
      row.filter((v) => v !== undefined && v !== null && v !== "").map(Number)
    )
    .filter((arr) => arr.length > 0); // выкидываем пустые строки

  if (series.length === 0) {
    console.log("В таблице нет непустых строк");
    return;
  }

  // делаем подписи по X: 1, 2, 3, ... по длине самой длинной строки
  const maxLen = Math.max(...series.map((arr) => arr.length));
  const labels = Array.from({ length: maxLen }, (_, i) => i + 1);

  // цвета для разных строк
  const colors = ["orange", "purple", "brown", "green", "red", "blue"];

  // собираем наборы данных для Chart.js: одна строка Excel → один dataset
  const datasets = series.map((data, index) => {
    const color = colors[index % colors.length];
    return {
      label: `Строка ${index + 1}`, // подпись в легенде
      data, // значения из строки
      borderColor: color, // цвет линии
      pointBackgroundColor: color, // цвет точек
      borderWidth: 4,
      pointHoverRadius: 7,
      pointRadius: 4,
      backgroundColor: "rgba(255, 255, 255, 0.82)",
      borderRadius: 3,
      pointStyle: "triangle", // "circle", "rect", "triangle", "cross",
    };
  });

  console.log("datasets:", datasets);

  // если график уже есть — удаляем его, чтобы не наслаивался
  if (chart) {
    chart.destroy();
  }

  // создаём ОДИН график с несколькими линиями (по числу строк)
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets,
    },
    options: {
      animation: {
        duration: 800, // время анимации в мс
        easing: "easeOutQuart", // тип анимации
      },
      responsive: true,
      scales: {
        x: {
          ticks: {
            color: "#f0f0f0", // цвет подписей по оси X
            font: {
              size: 16,
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.46)", // цвет линий
            lineWidth: 1,
            drawOnChartArea: true, // линии внутри графика
            drawTicks: true, // рисовать «палочки» на оси
            borderColor: "#fb0000ff", // рамка вокруг графика
            borderWidth: 1,
          },
        },
        y: {
          ticks: {
            color: "#f0f0f0", // цвет подписей по оси Y
            font: {
              size: 16,
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.46)", // цвет линий
            lineWidth: 1,
            drawOnChartArea: true, // линии внутри графика
            drawTicks: true, // рисовать «палочки» на оси
            borderColor: "#fb0000ff", // рамка вокруг графика
            borderWidth: 1,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#ffffff", // цвет текста в легенде ("Строка 1", "Строка 2" и т.п.)
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
            color: "#f0f0f0", // цвет подписей по оси X
            font: {
              size: 16,
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.46)", // цвет линий
            lineWidth: 1,
            drawOnChartArea: true, // линии внутри графика
            drawTicks: true, // рисовать «палочки» на оси
            borderColor: "#fb0000ff", // рамка вокруг графика
            borderWidth: 1,
          },
        },
        y: {
          ticks: {
            color: "#f0f0f0", // цвет подписей по оси Y
            font: {
              size: 16,
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.46)", // цвет линий
            lineWidth: 1,
            drawOnChartArea: true, // линии внутри графика
            drawTicks: true, // рисовать «палочки» на оси
            borderColor: "#fb0000ff", // рамка вокруг графика
            borderWidth: 1,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
            // цвет текста в легенде ("Строка 1", "Строка 2" и т.п.)
            font: {
              size: 20,
            },
          },
        },
      },
    },
  });
}
