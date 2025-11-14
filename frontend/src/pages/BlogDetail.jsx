/**
 * Blog Detail Page Component
 *
 * Individual blog post page with full content, SEO meta tags, and social sharing.
 *
 * Design Features:
 * - Full SEO optimization with meta tags
 * - Open Graph and Twitter Card support
 * - Structured data for rich snippets
 * - Beautiful typography and reading experience
 * - Related posts section
 * - Social sharing buttons
 * - Author information
 * - Reading progress indicator
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { API_ENDPOINTS } from '../config/api'
import '../styles/blog-content.css'

// Demo blog posts data (fallback if API fails)
const demoBlogPosts = [
  {
    id: 1,
    title: '10 Modern Living Room Design Trends for 2024',
    excerpt: 'Discover the latest trends in modern living room design, from minimalist aesthetics to bold statement pieces that transform your space.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200',
    category: 'Design Trends',
    author: 'Sarah Mitchell',
    authorImage: 'https://i.pravatar.cc/150?img=1',
    authorBio: 'Senior Interior Designer with 10+ years of experience in residential and commercial spaces.',
    date: 'March 15, 2024',
    datePublished: '2024-03-15',
    readTime: '5 min read',
    featured: true,
    content: `
      <p>The world of interior design is constantly evolving, and 2024 brings exciting new trends that blend comfort, sustainability, and cutting-edge aesthetics. Whether you're planning a complete renovation or just looking to refresh your living space, these modern living room trends will inspire your next design project.</p>

      <h2>1. Organic Modernism</h2>
      <p>This year sees a beautiful marriage of natural materials with sleek, modern design. Think raw wood furniture paired with minimalist metal accents, creating spaces that feel both grounded and contemporary. The key is balance – maintaining clean lines while incorporating textures from nature.</p>

      <h2>2. Sustainable Luxury</h2>
      <p>Eco-friendly doesn't mean compromising on style. Designers are increasingly using reclaimed materials, sustainable fabrics, and energy-efficient lighting to create luxurious spaces with a conscience. Look for furniture made from bamboo, recycled metals, and organic textiles.</p>

      <h2>3. Multifunctional Spaces</h2>
      <p>With the rise of hybrid work models, living rooms are serving multiple purposes. Smart storage solutions, convertible furniture, and designated work zones are becoming essential. The trend is towards flexible spaces that can easily transform from a home office to an entertainment area.</p>

      <h2>4. Bold Color Blocking</h2>
      <p>While neutral palettes remain popular, we're seeing a surge in bold, confident color choices. Think deep emerald greens, rich terracottas, and vibrant blues used strategically to create focal points and add personality to living spaces.</p>

      <h2>5. Curved Furniture</h2>
      <p>Sharp angles are giving way to soft, organic curves. Rounded sofas, circular coffee tables, and arched doorways create a more inviting, flowing space. This trend adds visual interest while maintaining a calm, harmonious atmosphere.</p>

      <h2>6. Statement Lighting</h2>
      <p>Lighting is no longer just functional – it's art. Sculptural pendant lights, artistic floor lamps, and creative LED installations are becoming centerpieces in modern living room design. The right lighting can completely transform the mood and aesthetic of a space.</p>

      <h2>7. Textural Layering</h2>
      <p>Mixing different textures adds depth and visual interest. Combine smooth velvet upholstery with chunky knit throws, sleek glass with rough-hewn wood, and polished metals with natural stone. The interplay of textures creates a rich, sophisticated environment.</p>

      <h2>8. Biophilic Design</h2>
      <p>Bringing the outdoors in continues to be a major trend. Large plants, living walls, and natural materials help create a connection with nature. This approach not only looks beautiful but also improves air quality and promotes well-being.</p>

      <h2>9. Smart Home Integration</h2>
      <p>Technology seamlessly integrated into design is becoming standard. Voice-controlled lighting, automated window treatments, and hidden charging stations are being incorporated without disrupting the aesthetic harmony of the space.</p>

      <h2>10. Personalized Art Galleries</h2>
      <p>Gallery walls and curated art collections are making living rooms feel more personal and unique. Mix family photos with original artwork, prints, and sculptural pieces to create a space that truly reflects your personality and style.</p>

      <h2>Conclusion</h2>
      <p>These trends reflect a broader shift towards thoughtful, sustainable, and personalized interior design. The key is to choose elements that resonate with your lifestyle and aesthetic preferences. Remember, the best design trend is one that makes you feel comfortable and happy in your space.</p>

      <p>Ready to transform your living room? Our team of expert designers at HOH 108 can help you incorporate these trends into your unique space. <a href="/contact">Contact us today</a> for a consultation!</p>
    `,
    tags: ['living room', 'design trends', 'modern design', '2024 trends', 'interior inspiration'],
  },
  {
    id: 2,
    title: 'The Ultimate Guide to Kitchen Remodeling',
    excerpt: 'Planning a kitchen renovation? Our comprehensive guide covers everything from layout planning to choosing the perfect materials.',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1200',
    category: 'Renovation',
    author: 'David Chen',
    authorImage: 'https://i.pravatar.cc/150?img=12',
    authorBio: 'Kitchen design specialist focusing on functional and beautiful modular kitchens.',
    date: 'March 10, 2024',
    datePublished: '2024-03-10',
    readTime: '8 min read',
    featured: false,
    content: `
      <p>Kitchen remodeling is one of the most rewarding home improvement projects you can undertake. A well-designed kitchen not only increases your home's value but also enhances your daily life. This comprehensive guide will walk you through every step of the process.</p>

      <h2>Planning Your Kitchen Remodel</h2>
      <p>The first step in any successful kitchen renovation is thorough planning. Start by assessing your current kitchen's pain points and creating a wish list of features you'd like to have. Consider your cooking habits, storage needs, and how the space will be used.</p>

      <h2>Setting a Realistic Budget</h2>
      <p>Kitchen remodels can range from minor updates to complete overhauls. Set a realistic budget that includes a 10-20% contingency for unexpected costs. Remember to allocate funds across all elements: cabinets (typically 30-40% of budget), appliances (15-20%), countertops (10-15%), and labor.</p>

      <h2>Choosing the Right Layout</h2>
      <p>The kitchen work triangle (sink, stove, refrigerator) remains a fundamental principle. Popular layouts include L-shaped, U-shaped, galley, and open-plan designs. Choose based on your space constraints and workflow preferences.</p>

      <h2>Selecting Materials and Finishes</h2>
      <p>Quality materials are worth the investment. For countertops, consider quartz for durability, granite for natural beauty, or butcher block for warmth. Cabinet materials should balance aesthetics with functionality – solid wood offers timeless appeal, while high-quality laminates provide cost-effective durability.</p>

      <h2>Lighting Design</h2>
      <p>Layer your lighting with ambient (ceiling fixtures), task (under-cabinet lights), and accent lighting. LED strips under cabinets provide excellent task lighting while creating a modern ambiance. Don't forget natural light – maximize windows where possible.</p>

      <h2>Storage Solutions</h2>
      <p>Maximize storage with pull-out drawers, corner carousel units, and vertical dividers. Consider your specific needs: deep drawers for pots and pans, spice pull-outs, appliance garages, and dedicated recycling stations.</p>

      <h2>Conclusion</h2>
      <p>A successful kitchen remodel requires careful planning, smart budgeting, and attention to both form and function. Take your time in the planning phase, and don't hesitate to work with professionals who can bring your vision to life.</p>
    `,
    tags: ['kitchen remodel', 'renovation guide', 'modular kitchen', 'home improvement'],
  },
  {
    id: 3,
    title: 'Color Psychology in Interior Design',
    excerpt: 'Learn how different colors affect mood and atmosphere, and how to choose the perfect palette for each room in your home.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200',
    category: 'Tips & Tricks',
    author: 'Emma Rodriguez',
    authorImage: 'https://i.pravatar.cc/150?img=5',
    authorBio: 'Color consultant and interior stylist specializing in creating harmonious living spaces.',
    date: 'March 5, 2024',
    datePublished: '2024-03-05',
    readTime: '6 min read',
    featured: false,
    content: `
      <p>Color is one of the most powerful tools in interior design. It can transform the mood of a space, influence emotions, and even affect our behavior. Understanding color psychology is essential for creating interiors that not only look beautiful but also feel right.</p>

      <h2>The Impact of Color on Emotions</h2>
      <p>Different colors evoke different emotional responses. Warm colors like red, orange, and yellow tend to energize and stimulate, while cool colors like blue, green, and purple have a calming, soothing effect. Neutral colors provide balance and versatility.</p>

      <h2>Red: Energy and Passion</h2>
      <p>Red is a bold, attention-grabbing color that increases energy levels and stimulates conversation. It's perfect for dining rooms and social spaces but can be overwhelming in bedrooms. Use red as an accent color to add warmth and excitement without overpowering the space.</p>

      <h2>Blue: Calm and Serenity</h2>
      <p>Blue is known for its calming properties, making it ideal for bedrooms and bathrooms. It can lower heart rate and reduce stress. Lighter shades create a sense of spaciousness, while deeper navy tones add sophistication and depth.</p>

      <h2>Yellow: Happiness and Optimism</h2>
      <p>Yellow brings sunshine and positivity into any space. It's excellent for kitchens and breakfast nooks, promoting cheerfulness and creativity. However, bright yellow can be overstimulating in large doses, so consider softer, buttery tones for larger areas.</p>

      <h2>Green: Balance and Harmony</h2>
      <p>Green connects us to nature and promotes balance and tranquility. It's versatile enough for any room and works particularly well in home offices and living rooms. From sage to emerald, green offers a wide range of options.</p>

      <h2>Purple: Luxury and Creativity</h2>
      <p>Purple combines the energy of red with the calm of blue, making it perfect for creative spaces. Lighter lavenders are soothing, while deeper purples add drama and luxury. Use it in bedrooms, creative studios, or reading nooks.</p>

      <h2>Neutral Colors: Timeless Elegance</h2>
      <p>Whites, grays, beiges, and taupes provide a sophisticated backdrop that never goes out of style. They create calm, spacious environments and allow you to easily update your decor with colorful accessories.</p>

      <h2>Choosing the Right Palette</h2>
      <p>When selecting colors, consider the room's purpose, natural light, and size. Use the 60-30-10 rule: 60% dominant color, 30% secondary color, and 10% accent color. Test paint samples in different lighting conditions before committing.</p>

      <h2>Conclusion</h2>
      <p>Color psychology is a powerful tool in creating spaces that not only look beautiful but also support your well-being and lifestyle. Don't be afraid to experiment, but always consider how each color makes you feel.</p>
    `,
    tags: ['color psychology', 'interior design', 'home decor', 'color theory', 'design tips'],
  },
  {
    id: 4,
    title: 'Sustainable Interior Design: Eco-Friendly Choices',
    excerpt: 'Explore sustainable materials, energy-efficient solutions, and eco-friendly practices for creating beautiful, environmentally conscious spaces.',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200',
    category: 'Sustainability',
    author: 'Michael Green',
    authorImage: 'https://i.pravatar.cc/150?img=13',
    authorBio: 'Sustainable design advocate with expertise in eco-friendly building materials and green architecture.',
    date: 'February 28, 2024',
    datePublished: '2024-02-28',
    readTime: '7 min read',
    featured: false,
    content: `
      <p>Sustainable interior design is no longer a niche trend—it's becoming a necessity. As we become more aware of our environmental impact, creating beautiful spaces that are also eco-friendly is more important than ever. Here's how to make sustainable choices without compromising on style.</p>

      <h2>Choose Sustainable Materials</h2>
      <p>Opt for materials with minimal environmental impact. Bamboo grows rapidly and regenerates quickly, making it an excellent sustainable choice for flooring and furniture. Reclaimed wood adds character while reducing demand for new timber. Cork, recycled glass, and natural stone are also eco-friendly options.</p>

      <h2>Low-VOC Paints and Finishes</h2>
      <p>Traditional paints release volatile organic compounds (VOCs) that harm air quality. Choose low-VOC or zero-VOC paints for healthier indoor air. These eco-friendly alternatives are now available in every color and finish imaginable.</p>

      <h2>Energy-Efficient Lighting</h2>
      <p>LED bulbs use up to 75% less energy than incandescent bulbs and last significantly longer. Install dimmer switches and smart lighting systems to reduce energy consumption further. Maximize natural light with strategic window placement and light-colored walls.</p>

      <h2>Sustainable Furniture</h2>
      <p>Look for furniture made from certified sustainable wood (FSC-certified), recycled materials, or rapidly renewable resources. Consider vintage and second-hand pieces—they're unique, often well-made, and keep furniture out of landfills.</p>

      <h2>Natural and Organic Textiles</h2>
      <p>Choose organic cotton, linen, hemp, and wool for curtains, upholstery, and bedding. These materials are grown without harmful pesticides and are biodegradable. Look for certifications like GOTS (Global Organic Textile Standard).</p>

      <h2>Indoor Plants for Air Quality</h2>
      <p>Plants aren't just decorative—they improve air quality by filtering toxins and producing oxygen. Snake plants, pothos, and peace lilies are excellent low-maintenance options that thrive indoors.</p>

      <h2>Water Conservation</h2>
      <p>Install low-flow faucets and showerheads in bathrooms and kitchens. Consider dual-flush toilets and water-efficient appliances. These simple changes can significantly reduce water consumption.</p>

      <h2>Insulation and Temperature Control</h2>
      <p>Proper insulation reduces heating and cooling needs. Use sustainable insulation materials like recycled denim, sheep's wool, or cellulose. Install programmable thermostats to optimize energy use.</p>

      <h2>Conclusion</h2>
      <p>Sustainable interior design is about making conscious choices that benefit both your home and the planet. Start with small changes and gradually incorporate more eco-friendly practices into your design approach.</p>
    `,
    tags: ['sustainable design', 'eco-friendly', 'green living', 'environmental design', 'sustainable materials'],
  },
  {
    id: 5,
    title: 'Small Space Solutions: Maximizing Your Home',
    excerpt: 'Smart design strategies and clever storage solutions to make the most of compact living spaces without sacrificing style.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
    category: 'Tips & Tricks',
    author: 'Lisa Park',
    authorImage: 'https://i.pravatar.cc/150?img=9',
    authorBio: 'Small space specialist helping clients maximize functionality in compact urban homes.',
    date: 'February 20, 2024',
    datePublished: '2024-02-20',
    readTime: '5 min read',
    featured: false,
    content: `
      <p>Living in a small space doesn't mean sacrificing style or functionality. With smart design strategies and creative solutions, you can make even the tiniest apartment feel spacious, organized, and beautiful.</p>

      <h2>Multi-Functional Furniture</h2>
      <p>Invest in furniture that serves multiple purposes. A sofa bed provides seating by day and sleeping space for guests. Ottoman storage doubles as seating and hidden storage. Fold-down desks and murphy beds maximize floor space when not in use.</p>

      <h2>Vertical Storage Solutions</h2>
      <p>When floor space is limited, think vertically. Install floating shelves, wall-mounted cabinets, and tall bookcases. Use the space above doors and in corners. Vertical storage draws the eye upward, making ceilings appear higher.</p>

      <h2>Light Colors and Mirrors</h2>
      <p>Light colors reflect light and make spaces feel larger. White, cream, and soft pastels open up rooms visually. Strategically placed mirrors amplify light and create the illusion of depth. A large mirror opposite a window can double the perceived space.</p>

      <h2>Smart Kitchen Organization</h2>
      <p>Use drawer dividers, pull-out organizers, and magnetic strips for knives. Install hooks under cabinets for mugs and utensils. A rolling cart can provide extra prep space and storage that moves where you need it.</p>

      <h2>Clever Closet Solutions</h2>
      <p>Maximize closet space with slim hangers, shelf dividers, and hanging organizers. Use the back of the closet door for shoes or accessories. Under-bed storage containers keep seasonal items out of sight.</p>

      <h2>Transparent and Light Furniture</h2>
      <p>Glass or acrylic furniture (coffee tables, chairs) takes up less visual space than solid pieces. Furniture with exposed legs creates a sense of openness by allowing light to flow underneath.</p>

      <h2>Declutter Regularly</h2>
      <p>In small spaces, clutter is magnified. Adopt a "one in, one out" policy. Regularly assess what you truly need and use. Minimalism isn't just aesthetic—it's practical in compact living.</p>

      <h2>Create Zones</h2>
      <p>Even in a studio apartment, you can create distinct zones for sleeping, working, and relaxing using rugs, furniture placement, or room dividers. This helps the space feel organized and purposeful.</p>

      <h2>Conclusion</h2>
      <p>Small space living requires creativity and intention, but with the right strategies, your compact home can be just as functional and stylish as a larger space. Focus on what matters most to you and design accordingly.</p>
    `,
    tags: ['small spaces', 'apartment living', 'storage solutions', 'space-saving', 'interior tips'],
  },
  {
    id: 6,
    title: 'Luxury Bedroom Design: Creating Your Dream Retreat',
    excerpt: 'Transform your bedroom into a luxurious sanctuary with these expert tips on lighting, textures, and sophisticated design elements.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200',
    category: 'Design Trends',
    author: 'Alexander James',
    authorImage: 'https://i.pravatar.cc/150?img=14',
    authorBio: 'Luxury interior designer specializing in high-end residential bedroom spaces.',
    date: 'February 15, 2024',
    datePublished: '2024-02-15',
    readTime: '6 min read',
    featured: false,
    content: `
      <p>Your bedroom should be a sanctuary—a place of rest, relaxation, and rejuvenation. Creating a luxury bedroom doesn't necessarily mean spending a fortune; it's about thoughtful design choices that elevate comfort and style.</p>

      <h2>Invest in Quality Bedding</h2>
      <p>The foundation of a luxury bedroom is premium bedding. High thread count sheets (300-600), a quality mattress, and plush pillows make an enormous difference. Layer with a duvet, throw blanket, and decorative cushions for a hotel-worthy look.</p>

      <h2>Create Ambient Lighting</h2>
      <p>Lighting sets the mood in a bedroom. Install dimmer switches for overhead lights. Add bedside lamps for reading, wall sconces for ambiance, and perhaps hidden LED strips behind the headboard. Multiple light sources allow you to adjust the atmosphere.</p>

      <h2>Choose a Statement Headboard</h2>
      <p>An upholstered headboard in velvet or linen adds instant luxury. Consider a tall, dramatic headboard that becomes a focal point. Tufted designs, wingback styles, or custom-built headboards with integrated lighting create sophisticated appeal.</p>

      <h2>Layer Textures</h2>
      <p>Luxury is in the details and textures. Mix materials: silk curtains, velvet throw pillows, linen sheets, a chunky knit blanket, and a plush area rug. The interplay of textures creates depth and visual interest.</p>

      <h2>Sophisticated Color Palette</h2>
      <p>Stick to a cohesive, calming color scheme. Neutrals like cream, taupe, gray, and soft white create a serene atmosphere. Add depth with darker accents in navy, charcoal, or forest green. Metallic touches in gold, brass, or chrome add glamour.</p>

      <h2>Incorporate Art and Decor</h2>
      <p>Large-scale artwork above the bed or a gallery wall adds personality. Fresh flowers, sculptural vases, and carefully chosen decorative objects elevate the space. Keep it minimal—curated rather than cluttered.</p>

      <h2>Window Treatments</h2>
      <p>Floor-to-ceiling curtains in luxurious fabrics add drama and sophistication. Layer sheer curtains with blackout drapes for versatility. Proper window treatments control light and provide privacy while adding softness to the room.</p>

      <h2>Seating Area</h2>
      <p>If space allows, add a reading nook with a comfortable chair and ottoman, or a bench at the foot of the bed. This creates a sense of luxury and provides a functional space for getting ready or unwinding.</p>

      <h2>Conclusion</h2>
      <p>Creating a luxury bedroom is about prioritizing comfort, quality, and cohesive design. Focus on the elements that matter most to you, and your bedroom will become the retreat you deserve.</p>
    `,
    tags: ['luxury bedroom', 'bedroom design', 'luxury interiors', 'bedroom decor', 'design inspiration'],
  },
  {
    id: 7,
    title: 'Smart Home Integration in Modern Design',
    excerpt: 'Seamlessly blend technology with aesthetics. Discover how to integrate smart home features while maintaining beautiful design.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200',
    category: 'Technology',
    author: 'Jessica Taylor',
    authorImage: 'https://i.pravatar.cc/150?img=10',
    authorBio: 'Tech-savvy designer specializing in smart home integration and automated living spaces.',
    date: 'February 10, 2024',
    datePublished: '2024-02-10',
    readTime: '7 min read',
    featured: false,
    content: `
      <p>Smart home technology has evolved from a luxury to an expected feature in modern homes. The challenge is integrating these technologies seamlessly into your design so they enhance rather than detract from your aesthetic vision.</p>

      <h2>Hidden Charging Stations</h2>
      <p>Eliminate visible cables with built-in charging drawers, wireless charging pads integrated into nightstands and desks, and pop-up outlets in kitchen islands. Keep technology accessible but concealed when not in use.</p>

      <h2>Smart Lighting Systems</h2>
      <p>Install smart bulbs and switches that allow you to control lighting via app or voice commands. Create scenes for different activities—bright for cleaning, dim for movie nights, warm for relaxing. Schedule lights to turn on/off automatically for security and energy savings.</p>

      <h2>Automated Window Treatments</h2>
      <p>Motorized blinds and curtains can be programmed to open with sunrise and close at sunset. Control them remotely or integrate with your smart home system. This adds convenience while maintaining privacy and temperature control.</p>

      <h2>Smart Thermostats</h2>
      <p>Modern thermostats learn your preferences and adjust temperature automatically. They can be controlled remotely and provide energy usage insights. Choose models with sleek, minimal designs that complement your decor.</p>

      <h2>Invisible Speakers</h2>
      <p>In-wall and in-ceiling speakers provide excellent sound without visible equipment. Wireless multi-room audio systems allow you to control music throughout your home from your phone. Sound bars can be mounted below TVs or hidden in furniture.</p>

      <h2>Voice Assistants</h2>
      <p>Integrate voice assistants like Alexa or Google Home into your design. Choose speakers with aesthetically pleasing designs or hide them within built-in shelving. Use them to control lights, temperature, music, and more with simple voice commands.</p>

      <h2>Security Systems</h2>
      <p>Modern security cameras and doorbells are increasingly sophisticated and discreet. Choose models that blend with your architecture. Many offer features like facial recognition, package detection, and two-way communication.</p>

      <h2>Smart Appliances</h2>
      <p>Refrigerators, ovens, washers, and dryers with smart features offer convenience and efficiency. Look for sleek, integrated designs that maintain your kitchen's aesthetic while providing technological benefits.</p>

      <h2>Conclusion</h2>
      <p>The key to successful smart home integration is making technology invisible and intuitive. Focus on features that genuinely improve your daily life, and ensure they're implemented in ways that enhance rather than compromise your design vision.</p>
    `,
    tags: ['smart home', 'home automation', 'technology', 'modern living', 'home tech'],
  },
  {
    id: 8,
    title: 'Commercial Office Design: Boosting Productivity',
    excerpt: 'How thoughtful office design can enhance employee productivity, creativity, and well-being in the modern workplace.',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200',
    category: 'Commercial',
    author: 'Robert Williams',
    authorImage: 'https://i.pravatar.cc/150?img=11',
    authorBio: 'Commercial interior designer with 15+ years creating productive and inspiring workspaces.',
    date: 'February 5, 2024',
    datePublished: '2024-02-05',
    readTime: '8 min read',
    featured: false,
    content: `
      <p>Office design directly impacts employee productivity, creativity, and well-being. As work environments evolve, creating spaces that support various work styles and promote collaboration is more important than ever.</p>

      <h2>Flexible Workspace Layouts</h2>
      <p>Move beyond traditional cubicles to create zones for different work modes: quiet focus areas, collaborative spaces, casual meeting zones, and social areas. Give employees choice in where and how they work.</p>

      <h2>Ergonomic Furniture</h2>
      <p>Invest in adjustable desks, supportive chairs, and monitor arms that allow proper positioning. Ergonomic furniture reduces strain and fatigue, leading to healthier, more productive employees. Standing desk options promote movement throughout the day.</p>

      <h2>Natural Light and Views</h2>
      <p>Maximize natural light—it boosts mood, energy, and productivity while reducing eye strain. Position workstations near windows when possible. Use glass partitions to allow light to penetrate deeper into the space.</p>

      <h2>Biophilic Design Elements</h2>
      <p>Incorporate plants, natural materials, water features, and nature-inspired patterns. Studies show biophilic design reduces stress, improves creativity, and enhances overall well-being. Living walls and planters bring nature indoors.</p>

      <h2>Color Psychology for Productivity</h2>
      <p>Use blue to promote focus and productivity in concentration areas. Green for balance in common areas. Yellow sparingly to stimulate creativity. Keep walls mostly neutral with strategic color accents to avoid overwhelming the space.</p>

      <h2>Acoustic Design</h2>
      <p>Address noise with acoustic panels, sound-absorbing materials, and strategic zoning. Create quiet zones for focused work and designated areas for collaboration and conversation. White noise systems can mask distracting sounds.</p>

      <h2>Technology Integration</h2>
      <p>Ensure adequate power outlets and USB ports throughout. Provide wireless charging stations, video conferencing capabilities, and collaborative technology tools. Cable management keeps spaces tidy and professional.</p>

      <h2>Breakout and Social Spaces</h2>
      <p>Design comfortable areas for informal meetings, breaks, and social interaction. These spaces foster collaboration, creativity, and team bonding. Include varied seating options—sofas, café tables, lounge chairs.</p>

      <h2>Brand Identity</h2>
      <p>Incorporate company colors, values, and culture into the design. The space should reflect and reinforce brand identity while creating a sense of pride and belonging among employees.</p>

      <h2>Conclusion</h2>
      <p>Thoughtful office design is an investment in your most valuable asset—your people. By creating environments that support well-being, collaboration, and productivity, you create a workplace where employees thrive.</p>
    `,
    tags: ['office design', 'commercial interiors', 'workplace design', 'productivity', 'workspace'],
  },
  {
    id: 9,
    title: 'Bathroom Spa Design: Luxury at Home',
    excerpt: 'Create a spa-like experience in your own bathroom with these design ideas featuring natural materials and calming aesthetics.',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200',
    category: 'Renovation',
    author: 'Sophia Anderson',
    authorImage: 'https://i.pravatar.cc/150?img=16',
    authorBio: 'Bathroom design expert creating serene, spa-inspired spaces for ultimate relaxation.',
    date: 'January 30, 2024',
    datePublished: '2024-01-30',
    readTime: '5 min read',
    featured: false,
    content: `
      <p>Transform your daily routine into a luxurious ritual by creating a spa-inspired bathroom. With the right design elements, materials, and features, you can enjoy the serenity and indulgence of a spa retreat in your own home.</p>

      <h2>Natural Materials</h2>
      <p>Incorporate natural stone like marble, granite, or travertine for countertops and flooring. Wood accents add warmth—teak is particularly suitable for bathrooms due to its water resistance. Bamboo accessories reinforce the natural, organic aesthetic.</p>

      <h2>Calming Color Palette</h2>
      <p>Choose soft, neutral colors that promote relaxation: whites, creams, soft grays, and muted earth tones. Add subtle blue or green accents to evoke water and nature. Keep the palette cohesive and serene.</p>

      <h2>Luxurious Shower Experience</h2>
      <p>Install a rain shower head for a gentle, immersive experience. Add body jets, a handheld sprayer, or a steam shower feature. Frameless glass enclosures create an open, spa-like feel. Heated floors add comfort and luxury.</p>

      <h2>Soaking Tub</h2>
      <p>A freestanding soaking tub becomes a stunning focal point. Position it near a window if possible, or create a peaceful view with plants and artwork. Add a bath caddy for candles, a book, and a glass of wine.</p>

      <h2>Ambient Lighting</h2>
      <p>Layer your lighting with dimmers for ultimate control. Install soft, warm LED strips along the base of cabinets or tub. Add candles for authentic spa ambiance. Avoid harsh overhead lighting—create a gentle, relaxing glow instead.</p>

      <h2>Plush Textiles</h2>
      <p>Invest in high-quality, oversized towels and a plush bath mat. Choose organic cotton or bamboo for a luxurious, eco-friendly feel. A heated towel rack keeps towels warm and adds a touch of indulgence.</p>

      <h2>Plants and Greenery</h2>
      <p>Add humidity-loving plants like ferns, orchids, or peace lilies. They thrive in bathroom conditions while purifying air and adding natural beauty. Hanging plants or a small living wall create a lush, tropical atmosphere.</p>

      <h2>Storage and Organization</h2>
      <p>Keep counters clutter-free with smart storage solutions. Recessed shelving in the shower for products, hidden storage behind mirrors, and drawer organizers maintain the spa's clean, minimal aesthetic.</p>

      <h2>Aromatherapy</h2>
      <p>Incorporate essential oil diffusers, scented candles, or eucalyptus in the shower. Lavender promotes relaxation, eucalyptus opens airways, and citrus energizes. Scent is a powerful tool for creating a spa experience.</p>

      <h2>Conclusion</h2>
      <p>Creating a spa bathroom is about engaging all the senses—sight, touch, smell, and sound. With thoughtful design choices, you can transform your bathroom into a personal sanctuary for daily relaxation and rejuvenation.</p>
    `,
    tags: ['bathroom design', 'spa bathroom', 'luxury bath', 'bathroom renovation', 'relaxation'],
  },
]

const BlogDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [readingProgress, setReadingProgress] = useState(0)
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState([])

  // Fetch blog post from API
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true)
        const response = await fetch(API_ENDPOINTS.BLOG_BY_ID(id))
        const data = await response.json()

        if (data.success && data.data) {
          const blog = data.data
          // Format the blog post to match component structure
          const formattedPost = {
            id: blog._id,
            title: blog.title,
            excerpt: blog.excerpt,
            image: blog.image,
            category: blog.category,
            author: blog.author,
            authorImage: blog.authorImage,
            authorBio: blog.authorBio,
            date: new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            datePublished: new Date(blog.createdAt).toISOString().split('T')[0],
            readTime: blog.readTime,
            featured: blog.featured,
            content: blog.content,
            tags: blog.tags || [],
          }
          setPost(formattedPost)

          // Fetch related posts (same category)
          const relatedResponse = await fetch(`${API_ENDPOINTS.BLOGS}?category=${blog.category}`)
          const relatedData = await relatedResponse.json()
          if (relatedData.success && relatedData.data) {
            const related = relatedData.data
              .filter(p => p._id !== blog._id)
              .slice(0, 3)
              .map(p => ({
                id: p._id,
                title: p.title,
                excerpt: p.excerpt,
                image: p.image,
                category: p.category,
                readTime: p.readTime
              }))
            setRelatedPosts(related)
          }
        } else {
          // Try to find in demo data as fallback
          const demoPost = demoBlogPosts.find(p => p.id === parseInt(id))
          if (demoPost) {
            setPost(demoPost)
            // Get related demo posts
            const related = demoBlogPosts
              .filter(p => p.category === demoPost.category && p.id !== demoPost.id)
              .slice(0, 3)
            setRelatedPosts(related)
          }
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
        // Fallback to demo data
        const demoPost = demoBlogPosts.find(p => p.id === parseInt(id))
        if (demoPost) {
          setPost(demoPost)
          const related = demoBlogPosts
            .filter(p => p.category === demoPost.category && p.id !== demoPost.id)
            .slice(0, 3)
          setRelatedPosts(related)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPost()
  }, [id])

  // Handle scroll for reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const trackLength = documentHeight - windowHeight
      const progress = (scrollTop / trackLength) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent mx-auto mb-4"></div>
          <p className="font-body text-gray-600">Loading blog post...</p>
        </div>
      </div>
    )
  }

  // Show not found if post doesn't exist
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-primary mb-4">Post Not Found</h1>
          <p className="font-body text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-block bg-accent text-white px-6 py-3 rounded-full font-subheading hover:bg-accent/90 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  // Generate canonical URL
  const canonicalUrl = `https://hoh108.com/blog/${post.id}`

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{post.title} | HOH 108 Blog</title>
        <meta name="title" content={`${post.title} | HOH 108 Blog`} />
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta name="author" content={post.author} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:site_name" content="HOH 108" />
        <meta property="og:locale" content="en_US" />
        <meta property="article:published_time" content={post.datePublished} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={post.title} />
        <meta property="twitter:description" content={post.excerpt} />
        <meta property="twitter:image" content={post.image} />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />

        {/* Structured Data - Article */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.image,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "HOH 108",
              "logo": {
                "@type": "ImageObject",
                "url": "https://hoh108.com/logo.png"
              }
            },
            "datePublished": post.datePublished,
            "dateModified": post.datePublished,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            },
            "keywords": post.tags.join(', '),
            "articleSection": post.category,
            "wordCount": post.content.split(' ').length
          })}
        </script>

        {/* Breadcrumb Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://hoh108.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://hoh108.com/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": canonicalUrl
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-50 origin-left"
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      <article className="min-h-screen bg-white">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[60vh] min-h-[500px] overflow-hidden"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />

          {/* Breadcrumb */}
          <div className="absolute top-8 left-0 right-0 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-white/80 font-body text-sm">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
                <span>/</span>
                <span className="text-white">{post.title}</span>
              </nav>
            </div>
          </div>

          {/* Title and Meta */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block bg-accent text-white px-4 py-1 rounded-full text-sm font-subheading mb-4"
              >
                {post.category}
              </motion.span>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6"
              >
                {post.title}
              </motion.h1>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-6 text-white/90 font-body"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorImage}
                    alt={post.author}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <span>{post.author}</span>
                </div>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-body hover:bg-accent hover:text-white transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 p-8 bg-gray-50 rounded-2xl"
          >
            <div className="flex items-start gap-6">
              <img
                src={post.authorImage}
                alt={post.author}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="font-subheading text-2xl text-primary mb-2">About {post.author}</h3>
                <p className="font-body text-gray-600">{post.authorBio}</p>
              </div>
            </div>
          </motion.div>

          {/* Social Share */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <span className="font-subheading text-gray-600">Share this article:</span>
            <div className="flex gap-3">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={`https://www.facebook.com/sharer/sharer.php?u=${canonicalUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={`https://twitter.com/intent/tweet?url=${canonicalUrl}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${canonicalUrl}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-heading text-3xl text-primary mb-12 text-center">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <motion.article
                    key={relatedPost.id}
                    whileHover={{ y: -10 }}
                    onClick={() => {
                      navigate(`/blog/${relatedPost.id}`)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  >
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <span className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-subheading">
                        {relatedPost.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-subheading text-xl text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="font-body text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                      <div className="mt-4 text-xs text-gray-400 font-body">{relatedPost.readTime}</div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-3xl md:text-4xl mb-4">Ready to Transform Your Space?</h2>
            <p className="font-body text-xl text-white/90 mb-8">
              Let our expert designers bring your vision to life
            </p>
            <Link
              to="/contact"
              className="inline-block bg-accent text-white px-8 py-4 rounded-2xl font-subheading text-lg hover:bg-accent/90 transition-colors shadow-lg"
            >
              Get a Free Consultation
            </Link>
          </div>
        </section>
      </article>
    </>
  )
}

export default BlogDetail
