import { Divider, Footer, FooterBottom, FooterLink, FooterSection } from '@arcana-ui/core';
import { Link } from 'react-router-dom';
import './DemoFooter.css';

export function DemoFooter(): React.JSX.Element {
  return (
    <Footer border>
      <div className="forma-footer-grid">
        <div className="forma-footer-brand">
          <Link to="/" className="forma-footer-logo">
            FORMA
          </Link>
          <p className="forma-footer-tagline">Objects that endure.</p>
        </div>

        <FooterSection title="Shop">
          <FooterLink href="/shop">All Products</FooterLink>
          <FooterLink href="/shop?category=Kitchen">Kitchen</FooterLink>
          <FooterLink href="/shop?category=Home">Home</FooterLink>
          <FooterLink href="/shop?category=Living">Living</FooterLink>
          <FooterLink href="/shop?category=Furniture">Furniture</FooterLink>
        </FooterSection>

        <FooterSection title="Collections">
          <FooterLink href="/shop?category=Accessories">Accessories</FooterLink>
          <FooterLink href="/shop">New Arrivals</FooterLink>
          <FooterLink href="/shop">Best Sellers</FooterLink>
          <FooterLink href="/shop">Sale</FooterLink>
        </FooterSection>

        <FooterSection title="Company">
          <FooterLink href="/#about">About Forma</FooterLink>
          <FooterLink href="/#about">Sustainability</FooterLink>
          <FooterLink href="/#about">Contact</FooterLink>
          <FooterLink href="/#about">Careers</FooterLink>
        </FooterSection>
      </div>

      <Divider spacing="lg" />

      <FooterBottom>
        <span className="forma-footer-copy">&copy; 2026 Forma. All rights reserved.</span>
      </FooterBottom>
    </Footer>
  );
}
