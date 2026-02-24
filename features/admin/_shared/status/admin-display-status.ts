export type AdminDisplayStatus =
  | 'pending' // 승인대기
  | 'need_car' // 승인됐지만 usage 없음
  | 'key_out' // usage scheduled
  | 'driving' // checked_out
  | 'returned' // returned
  | 'return_check' // inspected
  | 'completed' // reservation closed, rejected
  | 'issue' //  cancelled, no_show
