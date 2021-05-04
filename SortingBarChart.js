
			//Global Variables
			var h = 400;
			var w = 800;
			var axisPadding = 200;
			var LeftLabelPadding = 4;
			var RightLabelPadding = 40;
			var barPadding = 0.05;
			var dataset;



			//importing CSV
			d3.csv("AgeChange.csv",function(data){ 
				
				//assigning to clobal variable and sorting
	    		dataset = data
				
				//converting measures 
				dataset.forEach(function(d) {
					d.Combined = d.Combined; //no change
					d.Gender = d.Gender; // no change
					d.Twenty = +d.Twenty;
					d.Thirty = +d.Thirty;
					d.Fourty = +d.Fourty;
    			});


				dataset.sort(function(a, b) {
				  		return d3.ascending(a.TwentyNULL, b.TwentyNULL)
				  			|| d3.descending(a.Twenty, b.Twenty);
      			});

				//defining scales
				var yScale = d3.scaleBand()
							.domain(d3.range(dataset.length)) //numerical values
							.rangeRound([0, h])
							.paddingInner(barPadding);

				var yAxisScale = d3.scaleBand()
							.domain(dataset.map(function(d,i) { //categorical values
								return d.Combined;
							}))
							.rangeRound([0, h])
							.paddingInner(barPadding);

				var xScale = d3.scaleLinear()
								//.domain([-d3.max(dataset, function(d) {return Math.abs(d.AccommodationFoodServices);})
								//		, d3.max(dataset, function(d) {return Math.abs(d.AccommodationFoodServices);})])
								.domain([-0.052, 0.052])
								.range([axisPadding + RightLabelPadding + LeftLabelPadding, w - RightLabelPadding]);

				//defining axis
				var yAxis = d3.axisLeft()
							.scale(yAxisScale);


				//Create SVG element
				var svg = d3.select("#myChart")
			  				.append("svg")
							.attr("width", w)
							.attr("height", h);

//initializing bars and labels

				//Create bars
				svg.selectAll("rect")
				   .data(dataset)
				   .enter()
				   .append("rect")
				   .attr("y", function(d, i) {
				   		return yScale(i);
				   	})
				   .attr("x", function(d) {
				   		return xScale(0);
				   	})
				   .attr("height", yScale.bandwidth())
				    .attr("width", function(d) {
				   		return 0;
				   	})
				   .attr("fill", function(d) {
				   			if (d.Gender == "Men") {
				     			return "#2fbec7"; //men
				    		} else if (d.Gender == "Women") {
				   				return "#f78c01"; //women
				    		}
				   	})
				   .on("mouseover", function(d) {
				   		d3.select(this)
				   		.attr("fill", function(d) {
				   			if (d.Gender == "Men") {
				     			return "#5edee4"; //men
				    		} else if (d.Gender == "Women") {
				   				return "#ffcb44"; //women
				    		}
			   			})
				   })
				   .on("mouseout", function(d) {
					   d3.select(this)
						.attr("fill", function(d) {
				   			if (d.Gender == "Men") {
				     			return "#2fbec7"; //men
				    		} else if (d.Gender == "Women") {
				   				return "#f78c01"; //women
				    		}
			   			})
				   })


				//Create labels
				svg.selectAll("text")
				   .data(dataset)
				   .enter()
				   .append("text")
				   .attr("x", function(d){
                		return xScale(0)
            		})
				   .text(function(d) { //with no text
				   		return " ";
				   })
				   .attr("text-anchor", "end")
				   .attr("y", function(d, i) {
				   		return yScale(i) + yScale.bandwidth() / 2 + 4;
				   })
				   .attr("font-family", "sans-serif")
				   .attr("font-size", "12px")
				   .attr("fill","#57595D")	


//filling in rects and labels on start

				 svg.selectAll("rect")
				 	.transition()
					.duration(1500)
					.attr("width", function(d) {
				   		return Math.abs(xScale(d.Twenty) - xScale(0));
				   	})
				   	.attr("x", function(d) {
				   		return xScale(Math.min(0, d.Twenty))
				   	})

				 svg.selectAll("text")
				 	.transition()
					.duration(1500)
					.attr("x", function(d) {
						if (d.Twenty > 0 ) {
			     			return xScale(d.Twenty) + RightLabelPadding - LeftLabelPadding + 2;
			    		} else if (d.Twenty < 0 ) {
			     			return xScale(d.Twenty) - LeftLabelPadding;
			    		} else if (d.Twenty == 0 ) {
			     			return xScale(d.Twenty);
			    		} 
				   	})
            		.text(function(d) {
						if (d.TwentyNULL == 1) {
					   		return "";
						} else 
						if (d.Twenty >= 0 ) {
			     			return "$" + d3.format(",")(d.Twenty); 
			    		} else if (d.Twenty < 0 ) {
			     			return "-$" + Math.abs(d3.format(",")(d.Twenty)); 
			    		} 

				   	})
			    	.attr("fill","#57595D")	
				   
				//creating axis
				svg.append("g")
					.attr("class","axis") //assign axis class
					.attr("transform","translate("+ axisPadding +",0)")
					.call(yAxis);

				d3.selectAll("g.tick")
			    	.selectAll("text")
			    	.attr("fill","#57595D")	


//////Updating Data and rebuilding Chart

				//dropdown selection updated
				d3.select("select")
				  .on("change",function(d){

					var selected = d3.select("#d3-dropdown").node().value; //selected string from dropdown

					var sortBars = function() {
						svg.selectAll("rect")
						   .sort(function(a, b) {
							   return d3.ascending(a[selected+"NULL"], b[selected+"NULL"])
					  			|| d3.descending(a[selected], b[selected]);
						   	})
						   .transition()
						   .duration(1000)
						   .attr("y", function(d, i) {
						   		return yScale(i);
						   })
					}

				   	//update rects
					svg.selectAll("rect")
						   .data(dataset)
						   .transition()
						   .duration(1000)
						   .attr("y", function(d, i) {
						   		return yScale(i);
						   	})
						   .attr("x", function(d) {
						   		return xScale(Math.min(0, d[selected]))
						   	})
						   .attr("height", yScale.bandwidth())
						   .attr("width", function(d) {
						   		return Math.abs(xScale(d[selected]) - xScale(0));
						   	})
						   .on("end",function(d,i){
						   		sortBars();
						   	})

					//Update labels
					svg.selectAll("text")
						   .data(dataset)
						   .transition()								
						   .duration(1000)							
						   .attr("x", function(d) {
								if (d[selected] > 0 ) {
					     			return xScale(d[selected]) + RightLabelPadding - LeftLabelPadding + 2;
					    		} else if (d[selected] < 0 ) {
					     			return xScale(d[selected]) - LeftLabelPadding;
					    		} else if (d[selected] == 0 ) {
					     			return xScale(d[selected]);
					    		} 
						   	})
		            		.text(function(d) {
		            			if (d[selected + "NULL"] == 1) {
						   		return "";
								} else 
								if (d[selected] >= 0 ) {
					     			return "$" + d3.format(",")(d[selected]); 
					    		} else if (d[selected] < 0 ) {
					     			return "-$" + Math.abs(d3.format(",")(d[selected])); 
					    		} 

				   	})
					
					//sort labels
					svg.selectAll("text")
						   .data(dataset)
						   .sort(function(a, b) {
						   		return d3.ascending(a[selected+"NULL"], b[selected+"NULL"])
					  			|| d3.descending(a[selected], b[selected]);
		      			   })
						   .transition()
						   .duration(1000)
						   .delay(1000)
						   .attr("y", function(d, i) {
						   		return yScale(i) + yScale.bandwidth() / 2 + 4;
						   })


					//sorting dataset to resent for next change
					dataset = dataset.sort(function(a, b) {
					   		return d3.descending(a[selected], b[selected]);
	      			})

	      			//Update axis domain and recalling axis 
	      			yAxisScale.domain(dataset.map(function(d,i) { //categorical values
									return d.Combined;
								}))
					svg.select(".axis")
				    	.transition()
				    	.delay(1000)
				    	.duration(1000)
						.call(yAxis)	
 				
				});
		
			});