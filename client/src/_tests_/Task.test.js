import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Task from '../src/components/Task';

describe('Task component', () => {
  const mockToggle = jest.fn();
  const mockDelete = jest.fn();
  const sample = { id: 1, text: 'Acheter lait', done: false };

  test('affiche le texte de la tâche', () => {
    render(<Task task={sample} onToggle={mockToggle} onDelete={mockDelete} />);
    expect(screen.getByText('Acheter lait')).toBeInTheDocument();
  });

  test('click sur toggle appelle onToggle', () => {
    render(<Task task={sample} onToggle={mockToggle} onDelete={mockDelete} />);
    const btn = screen.queryByRole('button', { name: /toggle/i }) || screen.getByText(/Acheter lait/);
    fireEvent.click(btn);
    expect(mockToggle).toHaveBeenCalled();
  });
});
