import ScheduleModel from "../models/Schedule.js";

export const create = async (req, res) => {
    try {
        const schedules = req.body.schedules;
        const employerId = req.params.employerId;
        const newSchedules = [];

        for (const schedule of schedules) {
            const {daysOfWeek, startTime, endTime, startRecur, endRecur, color, groupId} = schedule;

            const newSchedule = new ScheduleModel({
                employerId,
                daysOfWeek,
                startTime,
                endTime,
                startRecur,
                endRecur,
                color,
                groupId
            });

            await newSchedule.save();
            newSchedules.push(newSchedule);
        }

        res.status(200).json({newSchedules: newSchedules, message: 'Рабочее время успешно добавлено!'});
    } catch (err) {
        console.log("Server Error:", err.message);
        res.status(500).json({
            message: `Не удалось задать рабочее время! Ошибка: ${err.message}`,
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const schedule = await ScheduleModel.find().exec();

        res.json(schedule);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить графики работы!!',
        });
    }
}
export const remove = async (req, res) => {
    try {
        const scheduleId = req.params.scheduleId;

        if (!scheduleId) {
            return res.status(404).json({
                message: 'Расписание не найдено!'
            });
        }

        await ScheduleModel.findOneAndDelete(scheduleId);

        res.json({
            success: true,
            message: 'Расписание удалено!'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить расписание!',
        });
    }
}

export const update = async (req, res) => {
    try {
        const scheduleId = req.params.scheduleId;
        const editedSchedule = req.body

        const updatedSchedule = await ScheduleModel.findOneAndUpdate(
            {_id: scheduleId},
            editedSchedule,
            {new: true}
        );

        res.json({
            updatedSchedule: updatedSchedule,
            message: 'Расписание обновлено!'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить расписание!',
        });
    }
}