var data = [
  { name: "ISTJ", dem: 30, rep: 42, freq: 11.6 },
  { name: "ISFJ", dem: 34, rep: 36, freq: 13.8 },
  { name: "INFJ", dem: 49, rep: 22, freq: 1.5 },
  { name: "INTJ", dem: 19, rep: 40, freq: 2.1 },

  { name: "ISTP", dem: 28, rep: 38, freq: 5.4 },
  { name: "ISFP", dem: 33, rep: 26, freq: 8.8 },
  { name: "INFP", dem: 38, rep: 22, freq: 4.4 },
  { name: "INTP", dem: 17, rep: 34, freq: 3.3 },

  { name: "ESTP", dem: 27, rep: 35, freq: 4.3 },
  { name: "ESFP", dem: 39, rep: 31, freq: 8.5 },
  { name: "ENFP", dem: 34, rep: 31, freq: 8.1 },
  { name: "ENTP", dem: 26, rep: 28, freq: 3.2 },

  { name: "ESTJ", dem: 32, rep: 46, freq: 8.7 },
  { name: "ESFJ", dem: 33, rep: 37, freq: 12.3 },
  { name: "ENFJ", dem: 35, rep: 35, freq: 2.5 },
  { name: "ENTJ", dem: 26, rep: 40, freq: 1.8 }
];

// validation - all freq should sum up to 100
(function() {
  var sum = 0;
  for (var i in data) sum += data[i].freq;
  console.log(sum);
  if (Math.abs(100 - sum) > 1) throw "Error";
})();

for (var i in data) {
  // add independents
  data[i].ind = 100 - data[i].dem - data[i].rep;

  // values between [0;1]
  data[i].freq /= 100;
  data[i].ind /= 100;
  data[i].dem /= 100;
  data[i].rep /= 100;

  // ratio relative to total population
  data[i].ind *= data[i].freq;
  data[i].dem *= data[i].freq;
  data[i].rep *= data[i].freq;
}

// validation - all should sum up to 1
(function() {
  var sum = 0;
  for (var i in data) sum += data[i].ind + data[i].dem + data[i].rep;
  console.log(sum);
  if (Math.abs(1 - sum) > 0.01) throw "Error";
})();

function findByName(name) {
  for (var i in data) if (data[i].name == name) return data[i];
}
