export const ForecastingService = {
  async getForecast() {
    return [
      { date: 'Avr', actual: null, forecast: 75, lowerBound: 70, upperBound: 80 },
      { date: 'Mai', actual: null, forecast: 77, lowerBound: 71, upperBound: 83 }
    ];
  }
};