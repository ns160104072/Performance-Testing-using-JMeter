/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.51794322442422, "KoPercent": 0.48205677557579};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.34721478307445097, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06333333333333334, 500, 1500, "OurPartnersPage"], "isController": false}, {"data": [0.9429530201342282, 500, 1500, "OurPartnersPage-0"], "isController": false}, {"data": [0.09060402684563758, 500, 1500, "OurPartnersPage-1"], "isController": false}, {"data": [0.05704697986577181, 500, 1500, "NewsPage-1"], "isController": false}, {"data": [0.9060402684563759, 500, 1500, "NewsPage-0"], "isController": false}, {"data": [0.9093959731543624, 500, 1500, "Service-Education-TrainingPage-0"], "isController": false}, {"data": [0.030201342281879196, 500, 1500, "Service-Education-TrainingPage-1"], "isController": false}, {"data": [0.9328859060402684, 500, 1500, "Service-E-Commerce-SolutionPage-0"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "Service-E-Commerce-SolutionPage"], "isController": false}, {"data": [0.02, 500, 1500, "Service-Education-TrainingPage"], "isController": false}, {"data": [0.04697986577181208, 500, 1500, "Service-E-Commerce-SolutionPage-1"], "isController": false}, {"data": [0.09183673469387756, 500, 1500, "ProductsPage-1"], "isController": false}, {"data": [0.9387755102040817, 500, 1500, "ProductsPage-0"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "NewsPage"], "isController": false}, {"data": [0.13087248322147652, 500, 1500, "ContactPage-1"], "isController": false}, {"data": [0.9664429530201343, 500, 1500, "ContactPage-0"], "isController": false}, {"data": [0.0, 500, 1500, "HomePage"], "isController": false}, {"data": [0.03, 500, 1500, "Service-Mobile-App-DevelopmentPage"], "isController": false}, {"data": [0.17, 500, 1500, "Industry-HealthcarePage"], "isController": false}, {"data": [0.9366666666666666, 500, 1500, "Service-Mobile-App-DevelopmentPage-0"], "isController": false}, {"data": [0.04, 500, 1500, "Service-Mobile-App-DevelopmentPage-1"], "isController": false}, {"data": [0.07666666666666666, 500, 1500, "ContactPage"], "isController": false}, {"data": [0.9733333333333334, 500, 1500, "Industry-HealthcarePage-0"], "isController": false}, {"data": [0.21666666666666667, 500, 1500, "Industry-HealthcarePage-1"], "isController": false}, {"data": [0.06, 500, 1500, "ProductsPage"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3734, 18, 0.48205677557579, 2532.5018746652336, 0, 49845, 2034.5, 5191.0, 6692.75, 12889.000000000005, 56.56204556471159, 1388.4097906899462, 10.248817521509936], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["OurPartnersPage", 150, 1, 0.6666666666666666, 3100.186666666667, 1, 20124, 2649.0, 4820.7, 6218.299999999997, 15700.260000000078, 2.931634288394637, 96.87875615643202, 0.7593047323906501], "isController": false}, {"data": ["OurPartnersPage-0", 149, 0, 0.0, 332.1744966442953, 232, 3132, 267.0, 556.0, 758.0, 2165.5, 2.942802970453468, 2.7962375881359613, 0.3850933574616843], "isController": false}, {"data": ["OurPartnersPage-1", 149, 0, 0.0, 2788.697986577183, 534, 19854, 2351.0, 4562.0, 5378.0, 15518.5, 2.9471102496143042, 95.20309981234423, 0.3827789679674829], "isController": false}, {"data": ["NewsPage-1", 149, 1, 0.6711409395973155, 3688.610738255032, 2, 32920, 3167.0, 6062.0, 6966.5, 21753.5, 2.6510568642801227, 95.03532194105402, 0.33172961444025334], "isController": false}, {"data": ["NewsPage-0", 149, 0, 0.0, 562.1744966442953, 234, 23898, 271.0, 775.0, 1448.5, 13155.5, 2.67715969527095, 2.533366938200733, 0.33987378943869484], "isController": false}, {"data": ["Service-Education-TrainingPage-0", 149, 0, 0.0, 377.0872483221476, 233, 1865, 271.0, 753.0, 1048.5, 1783.5, 2.7901576719973034, 2.7002404813958276, 0.41416402943709973], "isController": false}, {"data": ["Service-Education-TrainingPage-1", 149, 1, 0.6711409395973155, 3686.1879194630874, 763, 18290, 3185.0, 6231.0, 7026.5, 15179.0, 2.764173345206293, 95.8076039985437, 0.4048719714677946], "isController": false}, {"data": ["Service-E-Commerce-SolutionPage-0", 149, 0, 0.0, 363.66442953020135, 234, 2228, 272.0, 728.0, 840.5, 2220.5, 2.7032911208679558, 2.6188132733408325, 0.4039097084890598], "isController": false}, {"data": ["Service-E-Commerce-SolutionPage", 150, 1, 0.6666666666666666, 3758.5466666666657, 2, 18812, 3299.0, 6191.600000000002, 7235.099999999999, 14836.04000000007, 2.6931432572669984, 87.37477234523404, 0.7968092143652261], "isController": false}, {"data": ["Service-Education-TrainingPage", 150, 2, 1.3333333333333333, 4036.253333333335, 1, 18549, 3567.5, 6986.600000000001, 7614.949999999999, 15377.310000000056, 2.7687025859682155, 98.02411251545858, 0.8110712341030326], "isController": false}, {"data": ["Service-E-Commerce-SolutionPage-1", 149, 0, 0.0, 3419.993288590604, 579, 18541, 2897.0, 5921.0, 6964.5, 14645.5, 2.686911674541061, 85.11789825238036, 0.39883845168968873], "isController": false}, {"data": ["ProductsPage-1", 147, 1, 0.6802721088435374, 3762.802721088435, 748, 17432, 3141.0, 7048.000000000001, 9154.999999999996, 16895.36000000001, 2.6171019601559578, 90.11109678492585, 0.33760420561163634], "isController": false}, {"data": ["ProductsPage-0", 147, 0, 0.0, 363.095238095238, 232, 3561, 269.0, 538.800000000005, 1033.1999999999994, 2901.000000000014, 2.642411605040355, 2.5108071208049467, 0.34578433112832774], "isController": false}, {"data": ["NewsPage", 150, 2, 1.3333333333333333, 4224.34, 268, 33162, 3701.5, 6769.7, 7701.999999999998, 28437.870000000083, 2.657689581856839, 97.1722771139706, 0.6654951607902198], "isController": false}, {"data": ["ContactPage-1", 149, 0, 0.0, 2374.328859060402, 545, 8633, 2170.0, 3887.0, 5074.0, 7509.5, 3.0545931650915357, 105.72054332422763, 0.3937561501875807], "isController": false}, {"data": ["ContactPage-0", 149, 0, 0.0, 292.71140939597336, 233, 1074, 265.0, 280.0, 684.5, 963.5, 3.073242167357631, 2.917179088546501, 0.39916133619000477], "isController": false}, {"data": ["HomePage", 150, 4, 2.6666666666666665, 7301.14, 2013, 49845, 4877.0, 13919.000000000002, 21082.999999999985, 39367.56000000019, 2.5783385186585766, 146.22293214565033, 0.3063455596713478], "isController": false}, {"data": ["Service-Mobile-App-DevelopmentPage", 150, 0, 0.0, 3837.4000000000005, 806, 19584, 3441.0, 5899.100000000001, 7281.649999999996, 15829.890000000067, 2.8666437335167982, 106.52772850733861, 0.8706310557848871], "isController": false}, {"data": ["Industry-HealthcarePage", 150, 0, 0.0, 2221.4866666666676, 775, 6730, 1905.0, 3628.2000000000007, 4881.9, 6593.320000000002, 3.1578947368421053, 102.79502467105263, 0.8912417763157895], "isController": false}, {"data": ["Service-Mobile-App-DevelopmentPage-0", 150, 0, 0.0, 363.3933333333333, 233, 3332, 269.5, 733.0, 997.2499999999982, 2683.2800000000116, 2.898214699744957, 2.8161363537560864, 0.44152489566427083], "isController": false}, {"data": ["Service-Mobile-App-DevelopmentPage-1", 150, 0, 0.0, 3473.8866666666677, 570, 18348, 3078.0, 5203.6, 6839.45, 15087.570000000058, 2.8816229300341956, 104.28435795039766, 0.4361831583547854], "isController": false}, {"data": ["ContactPage", 150, 1, 0.6666666666666666, 2649.326666666666, 0, 8905, 2500.5, 4182.7, 5344.5, 7761.070000000021, 3.0594762176715347, 108.10999820893163, 0.7864805888981806], "isController": false}, {"data": ["Industry-HealthcarePage-0", 150, 0, 0.0, 296.79333333333307, 232, 1864, 261.0, 278.9, 481.0999999999964, 1540.6600000000058, 3.2003413697461065, 3.0753280349903993, 0.4531733384894389], "isController": false}, {"data": ["Industry-HealthcarePage-1", 150, 0, 0.0, 1924.606666666668, 539, 6460, 1640.5, 3216.8, 4068.049999999998, 6322.810000000002, 3.176014736708378, 100.33291085720639, 0.4466270723496157], "isController": false}, {"data": ["ProductsPage", 150, 4, 2.6666666666666665, 4045.280000000001, 0, 17712, 3415.0, 7442.400000000001, 9352.649999999994, 17131.62000000001, 2.6592444200187924, 92.32702723066286, 0.6772070620667648], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: SSL peer shut down incorrectly", 7, 38.888888888888886, 0.18746652383502946], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 5.555555555555555, 0.02678093197643278], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.banglapuzzle.com:443 failed to respond", 10, 55.55555555555556, 0.2678093197643278], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3734, 18, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.banglapuzzle.com:443 failed to respond", 10, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: SSL peer shut down incorrectly", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["OurPartnersPage", 150, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.banglapuzzle.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NewsPage-1", 149, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.banglapuzzle.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Service-Education-TrainingPage-1", 149, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: SSL peer shut down incorrectly", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Service-E-Commerce-SolutionPage", 150, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.banglapuzzle.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Service-Education-TrainingPage", 150, 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: SSL peer shut down incorrectly", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.banglapuzzle.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["ProductsPage-1", 147, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: SSL peer shut down incorrectly", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NewsPage", 150, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.banglapuzzle.com:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HomePage", 150, 4, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: SSL peer shut down incorrectly", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.banglapuzzle.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ContactPage", 150, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.banglapuzzle.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ProductsPage", 150, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.banglapuzzle.com:443 failed to respond", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: SSL peer shut down incorrectly", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
