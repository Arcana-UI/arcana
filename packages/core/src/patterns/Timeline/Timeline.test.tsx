import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Timeline, TimelineItem } from './Timeline';

describe('Timeline', () => {
  it('renders as ordered list', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>Event</TimelineItem>
      </Timeline>,
    );
    expect(container.querySelector('ol')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <Timeline ref={ref}>
        <TimelineItem>Event</TimelineItem>
      </Timeline>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(
      <Timeline className="custom">
        <TimelineItem>Event</TimelineItem>
      </Timeline>,
    );
    expect(container.querySelector('ol')?.classList.contains('custom')).toBe(true);
  });

  it('renders standard variant by default', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>Event</TimelineItem>
      </Timeline>,
    );
    const ol = container.querySelector('ol');
    expect(ol?.className).not.toContain('compact');
    expect(ol?.className).not.toContain('alternating');
  });

  it('renders compact variant', () => {
    const { container } = render(
      <Timeline variant="compact">
        <TimelineItem>Event</TimelineItem>
      </Timeline>,
    );
    expect(container.querySelector('ol')?.className).toContain('compact');
  });

  it('renders alternating variant', () => {
    const { container } = render(
      <Timeline variant="alternating">
        <TimelineItem>Event</TimelineItem>
      </Timeline>,
    );
    expect(container.querySelector('ol')?.className).toContain('alternating');
  });

  it('renders items as li', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>First</TimelineItem>
        <TimelineItem>Second</TimelineItem>
      </Timeline>,
    );
    expect(container.querySelectorAll('li')).toHaveLength(2);
  });

  it('renders item with title', () => {
    render(
      <Timeline>
        <TimelineItem title="Launch">We launched!</TimelineItem>
      </Timeline>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Launch' })).toBeTruthy();
  });

  it('renders item with date', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem date="Jan 2026">Launch</TimelineItem>
      </Timeline>,
    );
    const time = container.querySelector('time');
    expect(time?.textContent).toBe('Jan 2026');
  });

  it('renders item with icon', () => {
    render(
      <Timeline>
        <TimelineItem icon={<svg data-testid="icon" />}>Event</TimelineItem>
      </Timeline>,
    );
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  it('renders complete status with check icon', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem status="complete">Done</TimelineItem>
      </Timeline>,
    );
    expect(container.querySelector('[class*="dotComplete"]')).toBeTruthy();
    expect(container.querySelector('[class*="checkIcon"]')).toBeTruthy();
  });

  it('renders active status with pulsing dot', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem status="active">In progress</TimelineItem>
      </Timeline>,
    );
    expect(container.querySelector('[class*="dotActive"]')).toBeTruthy();
  });

  it('renders pending status with empty dot', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem status="pending">Upcoming</TimelineItem>
      </Timeline>,
    );
    expect(container.querySelector('[class*="dotPending"]')).toBeTruthy();
  });

  it('TimelineItem forwards ref', () => {
    const ref = vi.fn();
    render(
      <Timeline>
        <TimelineItem ref={ref}>Event</TimelineItem>
      </Timeline>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('renders mixed status items', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem status="complete" title="Founded" date="2024">
          Started the company
        </TimelineItem>
        <TimelineItem status="active" title="Growing" date="2025">
          Expanding the team
        </TimelineItem>
        <TimelineItem status="pending" title="IPO" date="2026">
          Going public
        </TimelineItem>
      </Timeline>,
    );
    expect(container.querySelector('[class*="dotComplete"]')).toBeTruthy();
    expect(container.querySelector('[class*="dotActive"]')).toBeTruthy();
    expect(container.querySelector('[class*="dotPending"]')).toBeTruthy();
    expect(screen.getByText('Founded')).toBeTruthy();
    expect(screen.getByText('Growing')).toBeTruthy();
    expect(screen.getByText('IPO')).toBeTruthy();
  });
});
