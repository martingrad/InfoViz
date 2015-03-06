    /**
    * k means algorithm
    * wtf means 'why the face?'
    * @param data
    * @param k
    * @return {Object}
    */
   
    var nearestCentroidIndices;
   
    function kmeans(data, k){
        
        var headers = d3.keys(data[0]);
        
        // Create centroids from randomly chosen data items.
        var centroids = createCentroids(k, headers, data);  

        // Find index to the nearest centroids for each data item, using euclidean distances.
        nearestCentroidIndices = findNearestCentroidIndices(data, centroids);
     
        // Alter centroid positions until a quality measure threshold is reached.
		centroids = optimizeCentroids(data, k, centroids);
        
        // Return the array of assignments to be used for color coding of polylines.
        return nearestCentroidIndices;
    };

    // Function to create the Centroids
    function createCentroids(k, headers, _data)
    {
        console.log("1. Creating centroids");
        var _centroids = [];
        var dataLength = _data.length;
        var randomIndex;
        console.log("random indices:");
        for(var i = 0; i < k; ++i)
        {
            randomIndex = Math.round(Math.random() * (dataLength - 1));
            _centroids.push(_data[randomIndex]);
            console.log(randomIndex);
            var temp = Math.random();
        }
        
        /*
        // fultest
        _centroids.push( {A:0.8, B:0.60, C:0.80, D:0.60, F:0.80} );
        _centroids.push( {A:0.60, B:0.80, C:0.60, D:0.80, F:0.60} );
        _centroids.push( {A:0.68, B:0.30, C:0.30, D:0.30, F:0.68} );
        _centroids.push( {A:0.30, B:0.68, C:0.30, D:0.68, F:0.30} );
        _centroids.push( {A:0.45, B:0.20, C:0.40, D:0.20, F:0.40} );
        _centroids.push( {A:0.20, B:0.40, C:0.20, D:0.40, F:0.20} );
        */
        return _centroids;
    };
    
    // Function which returns an array with the indices for the nearest centroids.
    function findNearestCentroidIndices(data, centroids){
        
        console.log("2. Determining nearest centroids");
        
        var headers = d3.keys(data[0]);
    	var nearestCentroidIndices = [];
        var dataA;
        var temp;
        var nearestCentroidIndex;
        var euclideanDistance;

        for(var i = 0; i < data.length; i++)					// for each line
        {
        	nearestCentroidIndex = 666;
        	euclideanDistance = 666;
        	
        	for(var j = 0; j < centroids.length; j++)			// for each centroid
        	{
                temp = 0;
                for(var m = 0; m < headers.length; m++)
                {
                    dataA = data[i][headers[m]] - centroids[j][headers[m]];
                    temp += Number(dataA * dataA);     
                }
                 
				temp = Math.sqrt(temp);

				if(temp < euclideanDistance)
				{
					euclideanDistance = temp;
					nearestCentroidIndex = j;
				}
        	}
        	nearestCentroidIndices[i] = nearestCentroidIndex;
        }
        //console.log(nearestCentroidIndices);

        return nearestCentroidIndices;
    };

    function optimizeCentroids(data, k, centroids)
    {
        console.log("3. Optimizing centroids");
        
        var oldCentroids = centroids;                       // store current centroids for comparison with the ones that will be calculated
    	var cluster = [];                                   // one cluster (array of data items)
    	var clusters = [];                                  // array of clusters
    	
        // creating clusters
    	for(var indexValue = 0; indexValue < k; ++indexValue)          // for each cluster
    	{
    		cluster = [];
    		for(var i = 0; i < nearestCentroidIndices.length; ++i)     // for each data item     (hur kan nearestCentroidIndices kommas åt här...? :S)
    		{
    			if(nearestCentroidIndices[i] == indexValue)
    			{
    				cluster.push(data[i]);
    			}
    		}
    		clusters.push(cluster);
    	}

        var headers = d3.keys(data[0]);
    	var meanValues = [];
        var currentPropertySum = [];
        var tempMeanValue = {};

        // calculating mean values of clusters
    	for(var i = 0; i < clusters.length; ++i)                            // for each cluster
    	{
            tempMeanValue = {};
    		currentCluster = clusters[i];

            for(var m = 0; m < headers.length; ++m)                         // for each property of the data
            {
                currentPropertySum[m] = 0;
        		for(var j = 0; j < currentCluster.length; ++j)              // for each line within the cluster
        		{
                    currentPropertySum[m] += Number(currentCluster[j][headers[m]]);
        		}
                tempMeanValue[headers[m]] = currentPropertySum[m] / (currentCluster.length);
            }

            meanValues.push(tempMeanValue);
    	}

        // checking quality of cluster, using least squares
        console.log("4. Checking the Quality");

        var isEqualNumberOfCentroids = (oldCentroids.length == meanValues.length);
        var difference = 0.0;

        if(isEqualNumberOfCentroids)
        {
            for(var i = 0; i < meanValues.length; ++i)                      // for each cluster
            {
                for(var j = 0; j < headers.length; ++j)                     // for each property
                {
                    difference += Math.pow(Number(oldCentroids[i][headers[j]]) - Number(meanValues[i][headers[j]]), 2);
                }
            }
        }

        console.log(difference);

        if(!isEqualNumberOfCentroids || difference > 0.001)
        {
            console.log("=== Optimizing recursively. ===");
            nearestCentroidIndices = findNearestCentroidIndices(data,meanValues);
            meanValues = optimizeCentroids(data, k, meanValues);
        }
        
        console.log("Antal kluster:");
        console.log(clusters.length);
        return meanValues;
    };
    








