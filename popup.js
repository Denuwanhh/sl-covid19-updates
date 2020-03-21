var x = new XMLHttpRequest();

x.open('GET', 'http://hpb.health.gov.lk/api/get-current-statistical');
x.onload = function() {   
    var statisticalData = JSON.parse(x.responseText);

    document.getElementById('body-con-id').innerHTML = "<canvas id='main-pie-chart' class='default-padding' width='100' height='50'></canvas>"
                                                              +"<div class='topic-data-div' id='td-data-header-id'></div>"
                                                              +"<div id='sub-data-grid'></div>" 
                                                              +"<div class='footer' id='footer-id'></div>";

    var ctx = document.getElementById('main-pie-chart').getContext('2d');

    var mainDataPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
    	    datasets: [{
    	        data: [statisticalData.data.local_new_deaths, statisticalData.data.local_total_cases, statisticalData.data.local_recovered],
    	        backgroundColor: [
    	                '#c90029',
    	                '#3f8bcc',
    	                '#0098a2'
    	            ]
    	    }],
    	    labels: [
    	        'Death',
    	        'Total Cases',
    	        'Recovered'
    	    ]
    	},
    	options: {
    	    legend: {
    	      display: false,
    	      position: 'bottom'}
        }
    });

    document.getElementById('td-data-header-id').innerHTML = "<table style='width:100%; border-spacing: 0px '>"
                                                                +"<tr>"
                                                                +"<td class='td-data-header td-tot' title='Total local confirmed COVID-19 cases reported in Sri Lanka'>Total</td>"
                                                                +"<td class='td-data-header td-rec' title='Total local COVID-19 cases recovered and discharged in Sri Lanka'>Recovered</td>"
                                                                +"<td class='td-data-header td-death' title='Total deaths due to COVID-19 reported in Sri Lanka'>Death</td>"
                                                                +"</tr>"
                                                                +"<tr  id='main-sum'></tr>"
                                                                +"</table>";

    document.getElementById('main-sum').innerHTML = "<td class='td-data td-tot' title='Total local confirmed COVID-19 cases reported in Sri Lanka' >"+statisticalData.data.local_total_cases+"</td> <td class='td-data td-rec' title='Total local COVID-19 cases recovered and discharged in Sri Lanka'>"+statisticalData.data.local_recovered+"</td> <td class='td-data td-death' title='Total deaths due to COVID-19 reported in Sri Lanka'>"+statisticalData.data.local_new_deaths+"</td>";

    var i;
    var subDataDiv = "";
    
    for (i = 0; i < statisticalData.data.hospital_data.length; i++) {
      subDataDiv += "<div class='sub-data-div'>"
              			+"<div style='padding-bottom: 6px; '>"+statisticalData.data.hospital_data[i].hospital.name+"</div>"
              			+"<table style='width:100%; border-spacing: 0px' >"
               			+" <tr>"
                  		+"<td class='sub-data-txt'>Admitted</td>"
                  		+"<td class='sub-data-txt sub-data-test'>Tested</td>"
                		+"</tr>"
                		+"<tr>"
                  		+"<td class='sub-data-num' title='Total count of patients who are currently on treatment or observation on COVID-19 in "+statisticalData.data.hospital_data[i].hospital.name+"'>"+statisticalData.data.hospital_data[i].treatment_total+"</td>"
                  		+"<td class='sub-data-num sub-data-test' title='Total count of patients who have been treated or observed on COVID-19 in "+statisticalData.data.hospital_data[i].hospital.name+"' >"+statisticalData.data.hospital_data[i].cumulative_total+"</td>"
		                +"</tr>"
		              	+"</table>"
		            	+"</div>";
    }

    document.getElementById('sub-data-grid').innerHTML = subDataDiv;

    document.getElementById('update-on').innerHTML = "Last Updated On: "+statisticalData.data.update_date_time;

    document.getElementById('footer-id').innerHTML = "Data Source : Health Promotion Bureau, Sri Lanka";

};

x.send();