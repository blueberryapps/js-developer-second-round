var express = require('express');
var fs = require('fs');
var app = express();
var cors = require('cors')
var marked = require('marked');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(cors());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('index', {body: marked(fs.readFileSync('README.md').toString())});
});

app.get('/api/v1/application/constraints', function (req, res) {
  res.json({
    amountInterval:          {min: 10, max: 2000, step: 10, defaultValue: 400},  // IntervalBean:BigDecimal    Scrollable Amount interval
    termInterval:            {min: 3, max: 30, step: 1, defaultValue: 15},       // IntervalBean:Integer       Scrollable term interval
  })
})

app.get('/api/v1/application/first-loan-offer', function (req, res) {
  var amount = req.query.amount;
  var term = req.query.term;

  if (amount && term)
    res.json({
      totalPrincipal: amount,
      term: term,
      totalCostOfCredit: amount / 10,
      totalRepayableAmount: amount * 1.2,
      monthlyPayment: amount * 1.2 / term
    })
  else
    res.status(400).json({error: 'Please provide amount and term in query parameters', received_only: {amount, term}})
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
