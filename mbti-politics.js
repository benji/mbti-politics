function breakdownForType(type, party) {
  var sum = 0
  for (var j=0 ; j<data.length; j++) {
    if (data[j].name.indexOf(type) >= 0) {
      sum += data[j][party]
    }
  }
  return sum
}
function averagePreferenceForType(type, party, usefreq) {
  var sum = 0
  var totfreq = 0
  for (var j=0 ; j<data.length; j++) {
    if (data[j].name.indexOf(type) >= 0) {
      sum += data[j][party] * (usefreq?data[j].freq:1)
      totfreq += data[j].freq
    }
  }
  return sum/8/(usefreq?totfreq:1)
}

function buildAverageMatrixOntoAxis(types, usefreq) {
  var m = [[],[]]
  for (var i=0; i<types.length; i++) {
    m[0][i] = averagePreferenceForType(types[i], 'dem', usefreq)
    m[1][i] = averagePreferenceForType(types[i], 'rep', usefreq)
  }
  return m
}

function averagePreference(ax, party, usefreq) {
  return averagePreferenceForType(ax[0], party, usefreq) - averagePreferenceForType(ax[1], party, usefreq)
}

function buildAverageDiffMatrixOntoAxis(axis, usefreq) {
  var m = [[],[]]
  for (var i=0; i<axis.length; i++) {
    m[0][i] = averagePreference(axis[i], 'dem', usefreq)
    m[1][i] = averagePreference(axis[i], 'rep', usefreq)
  }
  return m
}

function buildIdentityMatrix(len) {
  var m = []
  for (var i=0; i<len; i++) {
    m[i] = m[i] || []
    for (var j=0; j<len; j++) {
      m[i][j] = (i==j?1:0)
    }
  }
  return m
}

function buildSpecialMatrix(axis) {
  var m = []
  for (var i=0; i<data.length; i++) {
    m[i] = m[i] || []
    for (var j=0; j<axis.length; j++) {
      m[i][j] = data[i].name.indexOf(axis[j][0]) > 0 ? 1 : -1
    }
  }
  return m
}

function scalar(a, b) {
  var s = 0
  for (var i in a) {
    s += a[i] * b[i]
  }
  return s
}

function projectPoint(evs, p) {
  return [[scalar(evs[0], p) , scalar(evs[1], p)]]
}

function computeColor(colorRatio, greyRatio) {
  var r, g, b
  if (colorRatio <= 0.5) {
    r = 1 + (greyRatio-1)/.5*colorRatio
    g = b = greyRatio/.5*colorRatio
  } else {
    g = r = greyRatio/.5*(1-colorRatio)
    b = 1 + (greyRatio-1)/.5*(1-colorRatio)
  }
  return "rgb("+parseInt(r*255)+", "+parseInt(g*255)+", "+parseInt(b*255)+")"
}

// returns in [0;1]
function getRepDemRatio(values, idx) {
  var diff, maxdiff = 0, mindiff = 0
  for (var i in values[0]) {
    var d = values[0][i] - values[1][i] // dem - rep
    if (i==idx) diff = d
    if (d>maxdiff) maxdiff = d
    if (d<mindiff) mindiff = d
  }
  var dx = maxdiff-mindiff
  return (diff - mindiff) / dx
}

// returns in [0;1]
function getRepDemRatioSpecial(values, idx) {
  var diff, maxdiff = 0, mindiff = 0
  for (var i in data) {
    var d = data[i].dem - data[i].rep // dem - rep
    if (i==idx) diff = d
    if (d>maxdiff) maxdiff = d
    if (d<mindiff) mindiff = d
  }
  var dx = maxdiff-mindiff
  return (diff - mindiff) / dx
}

function plotMbtiPolitics(selectedAxis, usefrequencies, graphSelector) {
  
  if (selectedAxis == categoriesRatioMethod) {
    m = buildAverageDiffMatrixOntoAxis(categoriesRatioMethod, usefrequencies)
    console.log(m)
    axisVectors = buildSpecialMatrix(categoriesRatioMethod)
    labels = eachLetterMethod
    ratioFunc = getRepDemRatioSpecial
  } else {
    m = buildAverageMatrixOntoAxis(selectedAxis, usefrequencies)
    axisVectors = buildIdentityMatrix(selectedAxis.length)
    labels = selectedAxis
    ratioFunc = getRepDemRatio
  }

  console.log("ID matrix=", axisVectors)

  var evs = pca(m)
  console.log("EVs", evs)

  var graph = []

  for (var i in axisVectors) {
    var pdata = projectPoint(evs, axisVectors[i])
    
    var rd = ratioFunc(m, i)
    var color = computeColor(rd,0.5)
    var label = labels[i]

    graph.push({ data: pdata,
      color: color,
      points: {
        show: true,
        symbol: "circle",
        fillColor: color
      },
      showLabels: true,
      labels: [label],
      labelPlacement: "right",
      canvasRender: true,
      cColor: "#AD8200"
    })
  }

  var p = $.plot(graphSelector, graph, {
    colors: ['#000'],
    series: {
	    points: { show: true, radius: 3 }
    },
    grid: {
      hoverable: true,
      markings: [
        { color: '#000', lineWidth: 1, xaxis: { from: 4.1, to: 4.1 } },
        { color: '#000', lineWidth: 1, yaxis: { from: 100, to: 100 } },
        { color: '#000', lineWidth: 1, yaxis: { from: 230, to: 230 } },
      ]
    },
    xaxis: { autoscaleMargin: 0.1  },
    yaxis: {
      autoscaleMargin: 0.1 
    }
  });

  $(graphSelector).bind("plothover", function(event, pos, item) {
    if (item) {
      console.log(item)
      console.log(''+item.series.mylabel)
    }
  })
}

