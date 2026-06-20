import { StarIcon } from "../components/icons";

type TestimonialCardProps = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export function TestimonialCard({ name, role, quote, rating }: TestimonialCardProps) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-header">
        <span className="testimonial-mark">{name.slice(0, 1)}</span>
        <div className="testimonial-title">
          <h3>{name}</h3>
          <span>{role}</span>
        </div>
      </div>
      <div className="stars" aria-label={`${rating} ستاره`}>
        {Array.from({ length: rating }).map((_, index) => (
          <StarIcon key={index} />
        ))}
      </div>
      <p>{quote}</p>
    </article>
  );
}