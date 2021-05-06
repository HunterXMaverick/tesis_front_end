export interface Congress {
  _id?: string,
  name: string,
  address_web: string,
  start_date: string,
  end_date: string,
  logo?: string,
  publicity_image?: string,
  limit_speaker_time?: string,
  regulations: string,
  politics?: string,
  capacity_speakers: number,
  capacity_participants: number,
  status_congress: boolean
}
