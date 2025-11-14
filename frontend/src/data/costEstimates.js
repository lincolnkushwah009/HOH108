/**
 * Cost Estimate Data
 * Pricing based on BHK configuration and package type
 */

export const costEstimateData = {
  '2BHK': {
    'Basic': 249886,
    'Standard': 354328.26,
    'Premium': 486541,
    'Luxury': 502518.14
  },
  '3BHK': {
    'Basic': 314690,
    'Standard': 452087,
    'Premium': 577530,
    'Luxury': 564531
  },
  '4BHK': {
    'Basic': 471585,
    'Premium': 597027,
    'Luxury': 649833
  }
}

export const bhkOptions = ['2BHK', '3BHK', '4BHK']

export const packageOptions = {
  '2BHK': ['Basic', 'Standard', 'Premium', 'Luxury'],
  '3BHK': ['Basic', 'Standard', 'Premium', 'Luxury'],
  '4BHK': ['Basic', 'Premium', 'Luxury']
}

export const packageDescriptions = {
  'Basic': 'Essential interiors with quality materials',
  'Standard': 'Enhanced design with premium finishes',
  'Premium': 'Luxury design with high-end materials',
  'Luxury': 'Ultra-premium with bespoke customization'
}
