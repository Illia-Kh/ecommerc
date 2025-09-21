# E-Commerce Boilerplate

A production-ready e-commerce application built with Next.js 15, TypeScript, Prisma, Stripe, and Docker.

## Features

- **Framework**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Auth.js with credentials provider
- **Payments**: Stripe Checkout with webhook support
- **Media**: Cloudinary for image uploads
- **Internationalization**: Czech and Ukrainian support
- **Analytics**: Google Analytics 4 and Meta Pixel
- **SEO**: Structured data, sitemaps, and robots.txt
- **Feeds**: Google Merchant Center XML feed
- **Deployment**: Docker with PostgreSQL

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerc
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your configuration values.

3. **Start with Docker**
   ```bash
   docker-compose up -d --build
   ```

4. **Run database migrations and seed**
   ```bash
   # Run migrations
   docker-compose exec web npx prisma migrate dev
   
   # Seed the database with demo products
   docker-compose exec web npm run db:seed
   ```

5. **Create an admin user**
   ```bash
   docker-compose exec web node scripts/create-admin.mjs
   ```

6. **Open the application**
   Visit http://localhost:3000

## Manual Setup (Development)

If you prefer to run without Docker:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up database**
   ```bash
   # Start PostgreSQL (using your preferred method)
   # Update DATABASE_URL in .env
   
   # Run migrations
   npm run db:migrate
   
   # Seed database
   npm run db:seed
   ```

3. **Create admin user**
   ```bash
   node scripts/create-admin.mjs
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Configuration

### Environment Variables

Required environment variables (see `.env.example`):

- `SITE_URL` - Your site URL
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` / `AUTH_SECRET` - Authentication secret
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `CLOUDINARY_*` - Cloudinary configuration
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_FB_PIXEL_ID` - Meta Pixel ID

### Database Schema

The application uses the following main models:
- **User**: Authentication and user management
- **Category**: Product categories
- **Product**: Product information with multilingual support
- **Order**: Order management
- **OrderItem**: Order line items

## API Routes

- `POST /api/upload` - Upload images to Cloudinary
- `POST /api/stripe/webhook` - Stripe webhook handler
- `GET /api/feeds/gmc` - Google Merchant Center XML feed
- `GET /robots.txt` - SEO robots file
- `GET /sitemap.xml` - Dynamic sitemap

## Key Features

### Multi-language Support
- Czech (default) and Ukrainian languages
- Translatable product names and descriptions
- Language switcher component

### E-commerce Functionality
- Product catalog with search and filtering
- Shopping cart with localStorage persistence
- Secure checkout with Stripe
- Order management and tracking
- Admin panel for product management

### SEO & Analytics
- Structured data (JSON-LD) for products
- Canonical URLs and hreflang tags
- Google Analytics 4 and Meta Pixel integration
- Automatic sitemap generation
- Google Merchant Center feed

### Security & Performance
- Role-based access control (USER/ADMIN)
- Protected routes with middleware
- Optimized images with Next.js Image
- Server-side rendering and caching

## Deployment

### Production Deployment

1. **Update environment variables**
   - Set `SITE_URL` to your production domain
   - Configure production database
   - Add production API keys

2. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```

3. **Set up reverse proxy**
   Use Nginx or Caddy to handle HTTPS and domain routing:

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl;
       server_name yourdomain.com;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/private.key;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. **Run migrations in production**
   ```bash
   docker-compose exec web npx prisma migrate deploy
   ```

### Scaling Considerations

- Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
- Consider Redis for session storage and caching
- Use a CDN for static assets
- Implement proper logging and monitoring
- Set up backup strategies for database

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with demo data
- `npm run db:studio` - Open Prisma Studio

### Adding New Products

Use the admin panel at `/admin` or directly through Prisma Studio:

```bash
npm run db:studio
```

### Customization

1. **Styling**: Edit Tailwind classes or add custom CSS
2. **Components**: Modify components in `src/components/`
3. **Pages**: Add new pages in `src/app/`
4. **API**: Create new API routes in `src/app/api/`
5. **Database**: Modify `prisma/schema.prisma` and run migrations

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open a GitHub issue or contact the development team.
