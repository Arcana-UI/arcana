import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { AspectRatio } from './AspectRatio';

describe('AspectRatio', () => {
  it('renders children', () => {
    const { container } = render(
      <AspectRatio>
        <img src="test.jpg" alt="Test" />
      </AspectRatio>,
    );
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('sets aspect-ratio style for video preset', () => {
    const { container } = render(
      <AspectRatio ratio="video">
        <div />
      </AspectRatio>,
    );
    expect(container.firstElementChild).toHaveStyle({ aspectRatio: `${16 / 9}` });
  });

  it('sets aspect-ratio for square preset', () => {
    const { container } = render(
      <AspectRatio ratio="square">
        <div />
      </AspectRatio>,
    );
    expect(container.firstElementChild).toHaveStyle({ aspectRatio: '1' });
  });

  it('sets aspect-ratio for numeric value', () => {
    const { container } = render(
      <AspectRatio ratio={4 / 3}>
        <div />
      </AspectRatio>,
    );
    expect(container.firstElementChild).toHaveStyle({ aspectRatio: `${4 / 3}` });
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <AspectRatio ref={ref}>
        <div />
      </AspectRatio>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
