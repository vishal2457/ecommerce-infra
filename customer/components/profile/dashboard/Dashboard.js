import React, { useEffect } from "react";
import { Button, Card, CardBody, CardHeader } from "../../UI";


function Dashboard({ }) {

  useEffect(() => {
    var ctx5 = document.getElementById("myChart5");

    var myChart5 = new Chart(ctx5, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3, 3, 6, 8, 2, 5, 1],
            borderColor: ["rgba(54, 67, 247)"],
            backgroundColor: ["rgba(255,69,0, 0)"],
            borderWidth: 2,
          },
          {
            label: "# of Votes",
            data: [2, 8, 6, 3, 3, 2, 5, 3, 19, 12, 4, 18],
            borderColor: ["rgba(255, 99, 132, 1)"],
            backgroundColor: ["rgba(255,69,0, 0)"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                maxTicksLimit: 5,
                callback: function (value, index, values) {
                  return "€" + value;
                },
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      },
    });
    return () => {};
  }, []);

  return (
    <>
      <div className="row counter_row">
        <div className="col-md-3">
          <Card className="cus_card shadow mb-4">
            <CardBody className="counter_box">
              <i class="fa fa-file-text-o counter_icon"></i>
              <div className="counter_title">Total Orders</div>
              <div className="totle_count">500</div>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="cus_card shadow mb-4">
            <CardBody className="counter_box">
              <i class="fa fa-files-o counter_icon"></i>
              <div className="counter_title">In Progress Orders</div>
              <div className="totle_count">500</div>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="cus_card shadow mb-4">
            <CardBody className="counter_box">
              <i class="fa fa-question-circle-o counter_icon"></i>
              <div className="counter_title">Total Inquiries</div>
              <div className="totle_count">50</div>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="cus_card shadow mb-4">
            <CardBody className="counter_box">
              <i class="fa fa-money counter_icon"></i>
              <div className="counter_title">Total Savings</div>
              <div className="totle_count">&euro; 50</div>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="myChart5 mb-5">
            <h4>Title of Chart</h4>
            <canvas id="myChart5" width="50" height="15"></canvas>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <div className="row">
        <div className="col-md-12">
          <h4>Title of Table</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th className="text-uppercase">Firma</th>
                  <th className="text-uppercase">Datum</th>
                  <th className="text-uppercase">Summe</th>
                  <th className="text-uppercase">Gespart</th>
                  <th className="text-uppercase">Abo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Firma</td>
                  <td>Datum</td>
                  <td>Summe</td>
                  <td>Gespart</td>
                  <td>Abo</td>
                </tr>
                <tr>
                  <td>Firma</td>
                  <td>Datum</td>
                  <td>Summe</td>
                  <td>Gespart</td>
                  <td>Abo</td>
                </tr>
                <tr>
                  <td>Firma</td>
                  <td>Datum</td>
                  <td>Summe</td>
                  <td>Gespart</td>
                  <td>Abo</td>
                </tr>
                <tr>
                  <td>Firma</td>
                  <td>Datum</td>
                  <td>Summe</td>
                  <td>Gespart</td>
                  <td>Abo</td>
                </tr>
                <tr>
                  <td>Firma</td>
                  <td>Datum</td>
                  <td>Summe</td>
                  <td>Gespart</td>
                  <td>Abo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
