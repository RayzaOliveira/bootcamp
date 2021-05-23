import { response, Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

// Passa a informacao de um arquivo para outro: DTO (Data Transfer Object)

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

// Soc: Separator os Concerns (Separação de preoccupações)

appointmentsRouter.get('/', (resquest, response) => {
  const appoiments = appointmentsRepository.all();

  return response.json(appoiments);
});

// POST http://localhost:3333/appintments
appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));

  const findAppoimentInSameDate = appointmentsRepository.findByDate(parsedDate);

  if (findAppoimentInSameDate) {
    return response
      .status(400)
      .json({ message: 'This appointment is already booked' });
  }

  const appointment = appointmentsRepository.create({
    provider,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
