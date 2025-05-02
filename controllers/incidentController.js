const db = require('../config/db');

exports.reportIncident = async (req, res) => {
  try {
    const { type, description, location } = req.body;
    const reporterId = req.userData.userId;
    
    // Reportar incidente
    const [result] = await db.execute(
      'INSERT INTO incidents (type, description, location, reporter_id) VALUES (?, ?, ?, ?)',
      [type, description, location, reporterId]
    );
    
    return res.status(201).json({
      message: 'Incidente reportado com sucesso',
      incidentId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao reportar incidente:', error);
    return res.status(500).json({ message: 'Erro ao reportar incidente' });
  }
};

exports.getIncidents = async (req, res) => {
  try {
    // Buscar incidentes
    const [incidents] = await db.execute(
      'SELECT incidents.*, users.name as reporter_name, users.apartment as reporter_apartment ' +
      'FROM incidents ' +
      'JOIN users ON incidents.reporter_id = users.id ' +
      'ORDER BY reported_date DESC'
    );
    
    return res.status(200).json(incidents);
  } catch (error) {
    console.error('Erro ao buscar incidentes:', error);
    return res.status(500).json({ message: 'Erro ao buscar incidentes' });
  }
};

exports.updateIncidentStatus = async (req, res) => {
  try {
    const incidentId = req.params.id;
    const { status } = req.body;
    
    // Atualizar status do incidente
    await db.execute(
      'UPDATE incidents SET status = ?, resolved_date = ? WHERE id = ?',
      [
        status, 
        status === 'resolved' ? new Date() : null, 
        incidentId
      ]
    );
    
    return res.status(200).json({
      message: 'Status do incidente atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar status do incidente:', error);
    return res.status(500).json({ message: 'Erro ao atualizar status do incidente' });
  }
};