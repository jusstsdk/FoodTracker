const weightCanvas = document.getElementById("weight-chart")

fetch('http://localhost:3000/weight_history/user/' + user.id)
    .then(response => response.json())
    .then(data => {
        let weightData = {
            labels: [],
            datasets: [{
                label: "Weight (kg)",
                data: [],
            }]
        }

        data.slice().reverse().forEach(item => {
            const date = new Date(item.date_mark);
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0"); // прибавляем 1, так как getMonth() возвращает месяцы от 0 до 11
            const formattedDate = `${day}/${month}`;

            weightData.labels.push(formattedDate);
            weightData.datasets[0].data.push(item.weight);
        })

        let weightChartOptions = {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 80,
                    fontColor: 'black'
                }
            },
            elements: {
                line: {
                    tension: 0.2,
                    borderWidth: 4,
                    borderColor: "#A47B75"
                },
                point: {
                    radius: 4,
                    backgroundColor: "#A47B75"
                }
            }
        }

        let lineChart = new Chart(weightCanvas, {
            type: 'line',
            data: weightData,
            options: weightChartOptions,
        })
    })
    .catch(error => console.error(error));

const waterCanvas = document.getElementById("water-chart")
fetch('http://localhost:3000/water_history/user/' + user.id)
    .then(response => response.json())
    .then(data => {
        const sums = data.reduce((acc, curr) => {
            const date = curr.date_mark;
            if (acc[date]) {
                acc[date] += curr.value;
            } else {
                acc[date] = curr.value;
            }
            return acc;
        }, {});

        let waterData = {
            labels: [],
            datasets: [{
                label: "Water (ml)",
                data: [],
            }]
        }

        for (const date of Object.keys(sums).reverse()) {
            const date_mark = new Date(date);
            const day = date_mark.getDate().toString().padStart(2, "0");
            const month = (date_mark.getMonth() + 1).toString().padStart(2, "0"); // прибавляем 1, так как getMonth() возвращает месяцы от 0 до 11
            const formattedDate = `${day}/${month}`;

            waterData.labels.push(formattedDate);
            waterData.datasets[0].data.push(sums[date]);
        }

        let waterChartOptions = {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 80,
                    fontColor: 'black'
                }
            },
            elements: {
                line: {
                    tension: 0.2,
                    borderWidth: 4,
                    borderColor: "#636E75"
                },
                point: {
                    radius: 4,
                    backgroundColor: "#636E75"
                }
            }
        }

        let lineChart = new Chart(waterCanvas, {
            type: 'line',
            data: waterData,
            options: waterChartOptions,
        })
    })
    .catch(error => console.error(error));



