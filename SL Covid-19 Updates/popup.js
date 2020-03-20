var x = new XMLHttpRequest();

x.open('GET', 'http://hpb.health.gov.lk/api/get-current-statistical');
x.onload = function() {   
    var statisticalData = JSON.parse(x.responseText);

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

    document.getElementById('main-sum').innerHTML = "<td class='td-data td-tot' >"+statisticalData.data.local_total_cases+"</td> <td class='td-data td-rec'>"+statisticalData.data.local_recovered+"</td> <td class='td-data td-death'>"+statisticalData.data.local_new_deaths+"</td>";

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

    document.getElementById('update-on').innerHTML = statisticalData.data.update_date_time;


};

x.send();